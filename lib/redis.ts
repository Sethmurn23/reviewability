// lib/redis.ts - Redis connection for BullMQ
// Use mock mode if REDIS_URL not set

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const isMockMode = !process.env.REDIS_URL || process.env.REDIS_URL.includes('your_');

// Mock Redis class for development
class MockRedis {
  private data = new Map();
  on(event: string, cb: Function) { 
    if (event === 'connect') setTimeout(() => cb(), 0);
    if (event === 'error') {} // Ignore errors in mock
    return this;
  }
  connect() { return this; }
  get(key: string) { return this.data.get(key); }
  set(key: string, val: any) { this.data.set(key, val); return Promise.resolve('OK'); }
  del(key: string) { this.data.delete(key); return Promise.resolve(1); }
  quit() { return Promise.resolve('OK'); }
}

let redis: any;

// Try to use real Redis, fall back to mock
try {
  if (isMockMode) {
    redis = new MockRedis();
  } else {
    // Dynamic import ioredis only when needed
    const Redis = require('ioredis');
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000,
    });
    redis.on('connect', () => console.log('✅ Redis connected'));
    redis.on('error', (err: Error) => console.error('❌ Redis error:', err.message));
  }
} catch (e) {
  console.log('⚠️ Running in MOCK mode (no Redis)');
  redis = new MockRedis();
}

// Queue definitions
export const QUEUES = {
  REVIEW_PROCESSING: 'review-processing',
  INSIGHT_GENERATION: 'insight-generation',
  RESPONSE_SENDING: 'response-sending',
  SCHEDULED_TASKS: 'scheduled-tasks',
};

// Worker configurations
export const WORKER_CONFIGS = {
  [QUEUES.REVIEW_PROCESSING]: { concurrency: 5, maxStalledCount: 2 },
  [QUEUES.INSIGHT_GENERATION]: { concurrency: 2, maxStalledCount: 1 },
  [QUEUES.RESPONSE_SENDING]: { concurrency: 10, maxStalledCount: 3 },
};

export const mockRedis = isMockMode;
console.log(isMockMode ? '⚠️ Redis: MOCK mode' : '✅ Redis: connected');

export default redis;