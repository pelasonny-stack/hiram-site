import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

import { contactRequestSchema, type ContactRequest } from "@/lib/ai/schemas";
import { rateLimit } from "@/lib/ratelimit";
import { env, hasResend } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 15;

const PER_IP_LIMIT = 5;
const PER_IP_WINDOW_SEC = 600;

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "throwaway.email",
  "yopmail.com",
]);

const LEADS_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(LEADS_DIR, "leads.ndjson");

type LeadTag = "qualified" | "borderline" | "unqualified";

function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "local";
}

function hashIp(ip: string): string {
  return "sha256:" + crypto.createHash("sha256").update(ip).digest("hex").slice(0, 8);
}

function classify(parsed: ContactRequest): LeadTag {
  if (parsed.budget === "lt_30k" || parsed.stage === "just_curious") {
    return "unqualified";
  }
  if (
    parsed.budget === "30_80k" &&
    (parsed.eventVolume === "lt_100k" || parsed.eventVolume === "unknown")
  ) {
    return "borderline";
  }
  return "qualified";
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function persistLead(record: Record<string, unknown>) {
  await fs.mkdir(LEADS_DIR, { recursive: true });
  await fs.appendFile(LEADS_FILE, JSON.stringify(record) + "\n", { flag: "a" });
}

function buildLeadEmailBody(parsed: ContactRequest, tag: LeadTag, ipHash: string) {
  const lines = [
    `Tag: ${tag}`,
    `IP hash: ${ipHash}`,
    "",
    `Name: ${parsed.name}`,
    `Email: ${parsed.email}`,
    `Company: ${parsed.company}`,
    `Role: ${parsed.role}`,
    `Stage: ${parsed.stage}`,
    `Event volume: ${parsed.eventVolume}`,
    `Timeline: ${parsed.timeline}`,
    `Budget: ${parsed.budget}`,
    `Source: ${parsed.source ?? "(not provided)"}`,
    "",
    "Problem:",
    parsed.problem,
    "",
    "Notes:",
    parsed.notes ?? "(none)",
  ];
  return lines.join("\n");
}

const AUTO_REPLY_BODY = `Hi,

Thanks for reaching out to Hiram. Based on what you shared, we likely aren't the right fit for this engagement — we're a small senior team and the math only works for us above a certain scope.

That said, we don't want to leave you stuck. Teams like Hey Carson (https://www.heycarson.com/) handle a much broader range of work and may be a better match for what you described. We'd encourage you to look at them or similar shops who specialize in shorter, narrower engagements.

If your scope or timeline shifts, you're always welcome to come back.

— Hiram
`;

async function sendEmails(
  parsed: ContactRequest,
  tag: LeadTag,
  ipHash: string,
): Promise<void> {
  if (!hasResend) {
    console.log(
      `[contact] resend not configured, skipping email. tag=${tag} company=${parsed.company}`,
    );
    return;
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(env.RESEND_API_KEY!);

    await resend.emails.send({
      from: env.LEAD_EMAIL_FROM!,
      to: env.LEAD_EMAIL_TO!,
      subject: `[hiram lead :: ${tag}] ${parsed.company}`,
      text: buildLeadEmailBody(parsed, tag, ipHash),
      replyTo: parsed.email,
    });

    if (tag === "unqualified") {
      await resend.emails.send({
        from: env.LEAD_EMAIL_FROM!,
        to: parsed.email,
        subject: "Thanks for reaching out to Hiram",
        text: AUTO_REPLY_BODY,
      });
    }
  } catch (err) {
    console.error("[contact] email dispatch failed", err);
  }
}

export async function POST(req: Request) {
  const ip = getIp(req);
  const ipHash = hashIp(ip);

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && !origin.endsWith(host)) {
    return new Response("Forbidden", { status: 403 });
  }

  const rl = await rateLimit(`contact:${ip}`, {
    limit: PER_IP_LIMIT,
    windowSec: PER_IP_WINDOW_SEC,
  });
  if (!rl.success) {
    return jsonResponse(
      { error: "Too many submissions. Try again later." },
      429,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse({ error: "Invalid input" }, 400);
  }

  const data = parsed.data;

  // Honeypot — silently drop.
  if (data.honeypot && data.honeypot.length > 0) {
    return jsonResponse({ ok: true });
  }

  // Disposable email check.
  const domain = data.email.split("@")[1]?.toLowerCase() ?? "";
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return jsonResponse({ error: "Please use your work email." }, 400);
  }

  const tag = classify(data);
  const record = {
    ts: new Date().toISOString(),
    tag,
    ipHash,
    ...data,
  };

  try {
    await persistLead(record);
  } catch (err) {
    console.error("[contact] persist failed", err);
    return jsonResponse({ error: "Something went wrong." }, 500);
  }

  try {
    await sendEmails(data, tag, ipHash);
  } catch (err) {
    console.error("[contact] sendEmails threw unexpectedly", err);
    // Don't fail the request — lead is already persisted.
  }

  return jsonResponse({ ok: true, tag });
}
