import "server-only";

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 15 * 60_000;
const MAX_KEYS = 5000;
const buckets = new Map<string, Bucket>();

/** Small in-process limiter for sensitive demo endpoints. Production should use a shared store. */
export function consumeRateLimit(key: string, limit: number): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || now >= current.resetAt) {
    if (buckets.size >= MAX_KEYS) {
      for (const [k, v] of buckets) {
        if (now >= v.resetAt) buckets.delete(k);
        if (buckets.size < MAX_KEYS) break;
      }
    }
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  current.count += 1;
  if (current.count > limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}
