// Simple in-memory rate limiter implementation
type RateLimitRecord = {
  timestamp: number;
  count: number;
};

const store = new Map<string, RateLimitRecord>();

export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs;      // Default: 1 minute window
    this.maxRequests = maxRequests; // Default: 10 requests per window
  }

  async check(responseClass: any, limit: number, key: string): Promise<void> {
    const now = Date.now();
    const record = store.get(key);

    if (!record) {
      store.set(key, { timestamp: now, count: 1 });
      return;
    }

    if (now - record.timestamp > this.windowMs) {
      store.set(key, { timestamp: now, count: 1 });
      return;
    }

    if (record.count >= limit) {
      throw new Error('Too Many Requests');
    }

    record.count++;
    store.set(key, record);
  }

  async isRateLimited(key: string, limit?: number): Promise<boolean> {
    const now = Date.now();
    const record = store.get(key);
    const max = limit ?? this.maxRequests;
    if (!record) return false;
    if (now - record.timestamp > this.windowMs) return false;
    return record.count >= max;
  }
}

export const mutationLimiter = new RateLimiter(60000, 10); // 10 write operations per minute
export const apiLimiter = new RateLimiter(60000, 100); // 100 read operations per minute
