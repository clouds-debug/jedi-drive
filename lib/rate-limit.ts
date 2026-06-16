// In-memory rate limiter. Single-process only (works on VPS / Node server).
// On serverless (Vercel) it's per-instance — protection is partial.
//
// Algorithm: fixed sliding window with per-key counter + optional lockout.

type Entry = {
  count: number;
  windowStart: number;
  lockUntil: number;
};

declare global {
  var __rateLimitStore: Map<string, Entry> | undefined;
}

const store: Map<string, Entry> =
  global.__rateLimitStore ?? new Map<string, Entry>();
if (process.env.NODE_ENV !== "production") global.__rateLimitStore = store;

const CLEANUP_EVERY_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupIfNeeded(now: number) {
  if (now - lastCleanup < CLEANUP_EVERY_MS) return;
  lastCleanup = now;
  for (const [k, e] of store) {
    if (e.lockUntil < now && now - e.windowStart > 24 * 60 * 60 * 1000) {
      store.delete(k);
    }
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
  locked: boolean;
};

export function rateLimit(opts: {
  key: string;
  max: number;
  windowMs: number;
  lockoutMs?: number; // if set, after `max` triggers a lockout for this duration
}): RateLimitResult {
  const now = Date.now();
  cleanupIfNeeded(now);

  const existing = store.get(opts.key);
  const entry: Entry = existing ?? { count: 0, windowStart: now, lockUntil: 0 };

  if (entry.lockUntil > now) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.ceil((entry.lockUntil - now) / 1000),
      locked: true,
    };
  }

  // Reset window if expired
  if (now - entry.windowStart >= opts.windowMs) {
    entry.count = 0;
    entry.windowStart = now;
    entry.lockUntil = 0;
  }

  entry.count += 1;

  if (entry.count > opts.max) {
    if (opts.lockoutMs) {
      entry.lockUntil = now + opts.lockoutMs;
    }
    store.set(opts.key, entry);
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: opts.lockoutMs
        ? Math.ceil(opts.lockoutMs / 1000)
        : Math.ceil((opts.windowMs - (now - entry.windowStart)) / 1000),
      locked: Boolean(opts.lockoutMs),
    };
  }

  store.set(opts.key, entry);
  return {
    ok: true,
    remaining: Math.max(0, opts.max - entry.count),
    retryAfterSec: 0,
    locked: false,
  };
}

/** Reset counter on successful action (so a good login doesn't punish further attempts). */
export function rateLimitReset(key: string) {
  store.delete(key);
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export function tooManyResponse(result: RateLimitResult, message: string) {
  return new Response(
    JSON.stringify({
      errors: [{ field: "form", message }],
      retryAfterSec: result.retryAfterSec,
      locked: result.locked,
    }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "Retry-After": String(result.retryAfterSec),
      },
    },
  );
}
