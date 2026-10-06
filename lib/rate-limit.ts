type Entry = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, Entry>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function checkLoginRateLimit(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now >= entry.resetAt) {
    attempts.set(key, {
      count: 0,
      resetAt: now + WINDOW_MS,
    });

    return {
      allowed: true,
      remaining: MAX_ATTEMPTS,
    };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.count,
  };
}

export function recordLoginFailure(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now >= entry.resetAt) {
    attempts.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return;
  }

  entry.count += 1;
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}
