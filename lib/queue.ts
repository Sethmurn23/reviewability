// lib/queue.ts - BullMQ queue setup (mock mode compatible)
import { QUEUES } from './redis';

// Simple in-memory queue for mock mode
class MockQueue {
  private jobs: any[] = [];
  private listeners: ((job: any) => void)[] = [];

  add(name: string, data: any, opts?: any) {
    const job = { name, data, ...opts, id: Date.now() };
    this.jobs.push(job);
    setTimeout(() => this.listeners.forEach(cb => cb(job)), 100);
    return Promise.resolve(job);
  }

  getJobCounts() {
    return Promise.resolve({ waiting: 0, active: 0, completed: this.jobs.length, failed: 0 });
  }

  on(event: string, cb: (job: any) => void) {
    if (event === 'completed') this.listeners.push(cb);
    return this;
  }
}

// Dynamic import BullMQ only when Redis is available
let Queue: any = null;
let reviewQueue: any, insightQueue: any, responseQueue: any;

const isMockMode = !process.env.REDIS_URL || process.env.REDIS_URL.includes('your_');

if (isMockMode) {
  console.log('⚠️ Queue: Using in-memory mock queue');
  reviewQueue = new MockQueue();
  insightQueue = new MockQueue();
  responseQueue = new MockQueue();
} else {
  try {
    const { Queue: BullQueue } = require('bullmq');
    Queue = BullQueue;
    const { redis } = require('./redis');
    
    reviewQueue = new Queue(QUEUES.REVIEW_PROCESSING, { connection: redis });
    insightQueue = new Queue(QUEUES.INSIGHT_GENERATION, { connection: redis });
    responseQueue = new Queue(QUEUES.RESPONSE_SENDING, { connection: redis });
  } catch (e) {
    console.log('⚠️ Queue: Using in-memory mock queue');
    reviewQueue = new MockQueue();
    insightQueue = new MockQueue();
    responseQueue = new MockQueue();
  }
}

// Add jobs to queues
export async function addReviewJob(data: { reviewId: string; content: string; rating: number; businessId: string }) {
  return reviewQueue.add('analyze', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  });
}

export async function addInsightJob(data: { userId: string; businessId: string; dateRange?: { start: Date; end: Date } }) {
  return insightQueue.add('generate', data, {
    attempts: 2,
    backoff: { type: 'exponential', delay: 5000 },
  });
}

export async function addResponseJob(data: { reviewId: string; response: string; method: 'email' | 'api' | 'manual' }) {
  return responseQueue.add('send', data, {
    attempts: 3,
    backoff: { type: 'fixed', delay: 2000 },
  });
}

export async function getQueueStats() {
  const [review, insight, response] = await Promise.all([
    reviewQueue.getJobCounts(),
    insightQueue.getJobCounts(),
    responseQueue.getJobCounts(),
  ]);
  return { review, insight, response };
}

export default { reviewQueue, insightQueue, responseQueue, addReviewJob, addInsightJob, addResponseJob };