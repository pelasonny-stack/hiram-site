import { createHash } from "crypto";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 8);
}

interface UsageArgs {
  route: string;
  inputTokens?: number;
  outputTokens?: number;
  cachedInputTokens?: number;
  latencyMs: number;
  ip: string;
  status?: number;
}

export function logUsage(args: UsageArgs): void {
  console.log(
    JSON.stringify({
      evt: "ai_usage",
      route: args.route,
      inputTokens: args.inputTokens ?? 0,
      outputTokens: args.outputTokens ?? 0,
      cachedInputTokens: args.cachedInputTokens ?? 0,
      latencyMs: args.latencyMs,
      ipHash: hashIp(args.ip),
      status: args.status ?? 200,
      ts: new Date().toISOString(),
    }),
  );
}
