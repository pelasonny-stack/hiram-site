import { LRUCache } from "lru-cache";
import { env, hasUpstash } from "./env";

type RateLimitResult = { success: boolean; remaining?: number; reset?: number };

const lru = new LRUCache<string, { count: number; reset: number }>({
  max: 5000,
  ttl: 60 * 60 * 1000,
});

let upstashLimiter: { limit: (key: string) => Promise<RateLimitResult> } | null = null;

async function getUpstashLimiter(limit: number, windowSec: number) {
  if (!hasUpstash) return null;
  if (upstashLimiter) return upstashLimiter;
  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis } = await import("@upstash/redis");
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL!,
    token: env.UPSTASH_REDIS_REST_TOKEN!,
  });
  upstashLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
    analytics: true,
    prefix: "hiram:rl",
  });
  return upstashLimiter;
}

export async function rateLimit(
  key: string,
  opts: { limit: number; windowSec: number },
): Promise<RateLimitResult> {
  const limiter = await getUpstashLimiter(opts.limit, opts.windowSec);
  if (limiter) return limiter.limit(key);

  const now = Date.now();
  const cur = lru.get(key);
  if (!cur || cur.reset < now) {
    lru.set(key, { count: 1, reset: now + opts.windowSec * 1000 });
    return { success: true, remaining: opts.limit - 1 };
  }
  cur.count += 1;
  return { success: cur.count <= opts.limit, remaining: Math.max(0, opts.limit - cur.count) };
}

const monthlyCounter = new LRUCache<string, number>({ max: 12, ttl: 32 * 24 * 60 * 60 * 1000 });

export async function incrementMonthlyCounter(key: string): Promise<number> {
  if (hasUpstash) {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL!,
      token: env.UPSTASH_REDIS_REST_TOKEN!,
    });
    const value = await redis.incr(`hiram:monthly:${key}`);
    if (value === 1) await redis.expire(`hiram:monthly:${key}`, 32 * 24 * 60 * 60);
    return value;
  }
  const cur = (monthlyCounter.get(key) ?? 0) + 1;
  monthlyCounter.set(key, cur);
  return cur;
}

export function currentMonthKey(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}
