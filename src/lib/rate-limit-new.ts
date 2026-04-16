// Simple in-memory rate limiter implementation
type RateLimitRecord = {
  timestamp: number;
  count: number;
};

const store = new Map<string, RateLimitRecord>();

const cleanup = () => {
  const now = Date.now();
  const expiryTime = now - 300000; // 5 minutes
  Array.from(store.entries()).forEach(([key, record]) => {
    if (record.timestamp < expiryTime) {
      store.delete(key);
    }
  });
};

export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs;      // Default: 1 minute window
    this.maxRequests = maxRequests; // Default: 10 requests per window
  }

  async check(_responseClass: any, limit: number, key: string): Promise<void> {
    // Run cleanup occasionally
    if (Math.random() < 0.01) { // 1% chance of cleanup on each request
      cleanup();
    }

    const now = Date.now();
    const record = store.get(key);

    if (!record) {
      store.set(key, { timestamp: now, count: 1 });
      return;
    }

    if (now - record.timestamp > this.windowMs) {
      // Window expired, reset count
      store.set(key, { timestamp: now, count: 1 });
      return;
    }

    if (record.count >= (limit || this.maxRequests)) {
      throw new Error('Too Many Requests');
    }

    record.count++;
    store.set(key, record);
  }
}

// Export a singleton instance
export const mutationLimiter = new RateLimiter(60000, 10); // 1 minute window, 10 requests max
