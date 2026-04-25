import { z } from "zod";

export const analysisSchema = z.object({
  diagnosis: z.object({
    symptom: z.string().describe("The user-described symptom, normalized in one sentence"),
    rootCauseHypotheses: z
      .array(z.string())
      .min(1)
      .max(3)
      .describe("1-3 root-cause hypotheses an engineer would actually investigate"),
    confidence: z.enum(["low", "medium", "high"]),
  }),
  suggestedSystem: z.object({
    eventsCaptured: z
      .array(z.string())
      .min(2)
      .max(6)
      .describe("Concrete event names with key fields, e.g. checkout_started{cart_value, geo, payment_method}"),
    decisionEngine: z
      .string()
      .max(600)
      .describe("One paragraph describing the decision logic with named conditions and thresholds"),
    actionsTriggered: z
      .array(z.string())
      .min(1)
      .max(5)
      .describe("Concrete actions the engine would emit, e.g. retry_payment_with_alt_gateway"),
  }),
  exampleDecision: z.object({
    rule: z.string().describe("Plain-English rule the engine emits"),
    examplePayload: z
      .record(z.string(), z.unknown())
      .describe("Realistic JSON the engine would produce for this rule"),
  }),
  estimatedImpact: z.object({
    effort: z.enum(["days", "weeks", "months"]),
    impactBracket: z.enum(["marginal", "meaningful", "transformative"]),
    rationale: z.string().max(280),
  }),
});

export type Analysis = z.infer<typeof analysisSchema>;

export const analyzeRequestSchema = z.object({
  problem: z.string().min(20).max(1500),
});

export const contactRequestSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  company: z.string().min(1).max(200),
  role: z.enum([
    "engineering",
    "product",
    "data_ml",
    "founder_clevel",
    "other",
  ]),
  problem: z.string().min(60).max(2000),
  stage: z.enum([
    "exploring",
    "building_internal",
    "live_needs_scale",
    "just_curious",
  ]),
  eventVolume: z.enum([
    "lt_100k",
    "100k_1m",
    "1m_10m",
    "10m_100m",
    "gt_100m",
    "unknown",
  ]),
  timeline: z.enum(["urgent", "1_3_months", "3_6_months", "6_plus"]),
  budget: z.enum(["lt_30k", "30_80k", "80_200k", "200k_plus", "unknown"]),
  source: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  honeypot: z.string().max(0).optional(),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;
