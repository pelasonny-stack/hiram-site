import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import { analysisSchema, analyzeRequestSchema } from "@/lib/ai/schemas";
import { ANALYZER_SYSTEM, analyzerUserMessage } from "@/lib/ai/prompts";
import {
  rateLimit,
  incrementMonthlyCounter,
  currentMonthKey,
} from "@/lib/ratelimit";
import { logUsage } from "@/lib/ai/usage";
import { hasAnthropic } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 30;

const MONTHLY_CAP = 15_000;
const PER_IP_LIMIT = 8;
const PER_IP_WINDOW_SEC = 60;

function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "local";
}

export async function POST(req: Request) {
  const ip = getIp(req);
  const start = Date.now();

  if (!hasAnthropic) {
    logUsage({ route: "analyze", latencyMs: Date.now() - start, ip, status: 503 });
    return new Response(
      JSON.stringify({ error: "AI demo not configured. Set ANTHROPIC_API_KEY." }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && !origin.endsWith(host)) {
    return new Response("Forbidden", { status: 403 });
  }

  const rl = await rateLimit(`analyze:${ip}`, {
    limit: PER_IP_LIMIT,
    windowSec: PER_IP_WINDOW_SEC,
  });
  if (!rl.success) {
    logUsage({ route: "analyze", latencyMs: Date.now() - start, ip, status: 429 });
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Try again in a moment." }),
      { status: 429, headers: { "content-type": "application/json" } },
    );
  }

  const monthlyKey = currentMonthKey();
  const monthlyCount = await incrementMonthlyCounter(`analyze:${monthlyKey}`);
  if (monthlyCount > MONTHLY_CAP) {
    logUsage({ route: "analyze", latencyMs: Date.now() - start, ip, status: 503 });
    return new Response(
      JSON.stringify({
        error: "Demo capacity reached for this month. Use /contact to talk to us.",
      }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid input" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const result = streamObject({
    model: anthropic("claude-haiku-4-5-20251001"),
    schema: analysisSchema,
    system: ANALYZER_SYSTEM,
    prompt: analyzerUserMessage(parsed.data.problem),
    temperature: 0.4,
    maxOutputTokens: 1200,
    providerOptions: {
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
    },
    onFinish: ({ usage }) => {
      logUsage({
        route: "analyze",
        inputTokens: usage?.inputTokens,
        outputTokens: usage?.outputTokens,
        cachedInputTokens: usage?.cachedInputTokens,
        latencyMs: Date.now() - start,
        ip,
      });
    },
  });

  return result.toTextStreamResponse();
}
