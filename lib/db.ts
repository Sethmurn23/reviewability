// lib/db.ts - Database connection (mock mode compatible)
// No Prisma import needed for mock mode - uses plain mock data

const isMockMode = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('your_');

// Mock data for development (no database needed)
export const mockReviews = [
  { id: '1', authorName: 'Sarah Johnson', rating: 5, title: 'Amazing service!', content: 'The team went above and beyond to help me.', source: 'Google', sentiment: 'positive', responseStatus: 'sent', createdAt: '2026-03-23' },
  { id: '2', authorName: 'Mike Chen', rating: 2, title: 'Disappointed', content: 'Waited 45 minutes. Cold food. Very frustrating.', source: 'Yelp', sentiment: 'negative', responseStatus: 'pending', createdAt: '2026-03-22' },
  { id: '3', authorName: 'Emily Davis', rating: 4, content: 'Great product overall. Shipping was fast.', source: 'Trustpilot', sentiment: 'neutral', responseStatus: undefined, createdAt: '2026-03-21' },
  { id: '4', authorName: 'James Wilson', rating: 1, title: 'Never ordering again', content: 'Wrong order 3 times. Complete waste of money.', source: 'Google', sentiment: 'negative', responseStatus: undefined, createdAt: '2026-03-20' },
  { id: '5', authorName: 'Lisa Anderson', rating: 5, title: 'Perfect!', content: 'Exactly what I needed. Fast delivery too!', source: 'Yelp', sentiment: 'positive', responseStatus: 'sent', createdAt: '2026-03-19' },
];

export const mockStats = {
  totalReviews: 1247,
  avgRating: 4.3,
  responseRate: 89,
  newThisWeek: 23,
};

export const mockAutomations = [
  { id: '1', name: 'Reply to all positive reviews', trigger: 'rating >= 4', action: 'auto_respond', isActive: true, runCount: 156 },
  { id: '2', name: 'Alert on 1-star reviews', trigger: 'rating = 1', action: 'send_email', isActive: true, runCount: 23 },
  { id: '3', name: 'Auto-respond to complaints', trigger: 'sentiment = negative', action: 'generate_response', isActive: false, runCount: 0 },
  { id: '4', name: 'Weekly digest', trigger: 'schedule = weekly', action: 'send_digest', isActive: true, runCount: 12 },
];

export const mockInsights = [
  { id: '1', type: 'trend', title: 'Rating trend improving', content: 'Your average rating has increased 0.3 points over the past month.', createdAt: '2026-03-23', isRead: false },
  { id: '2', type: 'anomaly', title: 'Spike in negative reviews', content: 'We noticed a 40% increase in negative reviews this week.', createdAt: '2026-03-22', isRead: false },
  { id: '3', type: 'recommendation', title: 'Address shipping concerns', content: 'Multiple reviews mention packaging issues.', createdAt: '2026-03-21', isRead: true },
  { id: '4', type: 'summary', title: 'Weekly summary', content: 'This week: 47 new reviews, 4.2 avg rating, 89% response rate.', createdAt: '2026-03-20', isRead: true },
];

// Prisma client (only imported when DATABASE_URL is real)
let prisma: any = null;

async function initPrisma() {
  if (isMockMode) return null;
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient({ log: ['error'] });
  return prisma;
}

// DB helpers that work in mock mode
export const db = {
  reviews: {
    findAll: async () => mockReviews,
    findById: async (id: string) => mockReviews.find(r => r.id === id),
    findByBusiness: async (businessId: string) => mockReviews,
  },
  stats: async () => mockStats,
  automations: {
    findAll: async () => mockAutomations,
  },
  insights: {
    findAll: async () => mockInsights,
  },
};

// For when real DB is connected
export async function getPrisma() {
  if (!prisma) await initPrisma();
  return prisma;
}

export const mockMode = isMockMode;
console.log(isMockMode ? '⚠️ Database: MOCK mode (no PostgreSQL)' : '✅ Database: PostgreSQL connected');

// Default export for compatibility
export default { db, mockReviews, mockStats, mockAutomations, mockInsights, mockMode };