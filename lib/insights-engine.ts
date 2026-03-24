// lib/insights-engine.ts - Basic insights engine
// Analyzes reviews to extract actionable insights

import type { Review } from './integrations/types';

// Keyword categories with weights
const keywordCategories = {
  // Negative themes (hurt rating)
  service: { keywords: ['service', 'staff', 'rude', 'helpful', 'wait', 'slow', 'quick', 'friendly', 'unfriendly'], weight: 1.2 },
  quality: { keywords: ['quality', 'cold', 'fresh', 'bad', 'good', 'terrible', 'great', 'amazing'], weight: 1.0 },
  waitTime: { keywords: ['wait', 'waiting', 'long', 'forever', 'minutes', 'hours', 'quick', 'fast'], weight: 1.1 },
  orders: { keywords: ['order', 'wrong', 'correct', 'mistake', 'accuracy'], weight: 1.3 },
  value: { keywords: ['price', 'expensive', 'cheap', 'worth', 'value', 'overpriced'], weight: 0.9 },
  cleanliness: { keywords: ['clean', 'dirty', 'hygiene', 'spotless', 'mess'], weight: 0.8 },
  
  // Positive themes (boost rating)
  recommendation: { keywords: ['recommend', 'return', 'come back', 'definitely', 'again'], weight: 1.0 },
  compliments: { keywords: ['love', 'amazing', 'wonderful', 'excellent', 'perfect', 'best', 'fantastic'], weight: 1.1 },
};

// Count keyword occurrences across all reviews
export function analyzeKeywordFrequency(reviews: Review[]): {
  positive: { keyword: string; count: number; percentage: number }[];
  negative: { keyword: string; count: number; percentage: number }[];
} {
  const positiveCounts: Record<string, number> = {};
  const negativeCounts: Record<string, number> = {};
  
  const positiveWords = ['great', 'amazing', 'excellent', 'wonderful', 'love', 'best', 'perfect', 'fantastic', 'outstanding', 'friendly', 'helpful', 'fast', 'quick', 'recommend', 'return'];
  const negativeWords = ['terrible', 'worst', 'horrible', 'awful', 'disappointing', 'bad', 'cold', 'slow', 'rude', 'wrong', 'wait', 'frustrat'];
  
  reviews.forEach(review => {
    const lower = review.content.toLowerCase();
    
    positiveWords.forEach(word => {
      if (lower.includes(word)) {
        positiveCounts[word] = (positiveCounts[word] || 0) + 1;
      }
    });
    
    negativeWords.forEach(word => {
      if (lower.includes(word)) {
        negativeCounts[word] = (negativeCounts[word] || 0) + 1;
      }
    });
  });
  
  const total = reviews.length;
  
  const positive = Object.entries(positiveCounts)
    .map(([keyword, count]) => ({ keyword, count, percentage: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  const negative = Object.entries(negativeCounts)
    .map(([keyword, count]) => ({ keyword, count, percentage: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return { positive, negative };
}

// Calculate overall sentiment distribution
export function calculateSentimentDistribution(reviews: Review[]): {
  positive: number;
  negative: number;
  neutral: number;
} {
  const positive = reviews.filter(r => r.rating >= 4).length;
  const negative = reviews.filter(r => r.rating <= 2).length;
  const neutral = reviews.filter(r => r.rating === 3).length;
  
  return { positive, negative, neutral };
}

// Generate basic insights from reviews
export function generateBasicInsights(reviews: Review[]): {
  topComplaint: string | null;
  topPositive: string | null;
  recommendation: string | null;
  ratingTrend: 'up' | 'down' | 'stable';
  summary: string;
} {
  if (reviews.length === 0) {
    return {
      topComplaint: null,
      topPositive: null,
      recommendation: null,
      ratingTrend: 'stable',
      summary: 'No reviews to analyze',
    };
  }
  
  const { positive, negative } = analyzeKeywordFrequency(reviews);
  const distribution = calculateSentimentDistribution(reviews);
  
  // Determine top complaint
  let topComplaint = null;
  if (negative.length > 0) {
    const complaintMap: Record<string, string> = {
      'terrible': 'Overall experience',
      'worst': 'Overall experience', 
      'horrible': 'Overall experience',
      'disappointing': 'Overall quality',
      'cold': 'Food temperature',
      'slow': 'Service speed',
      'wait': 'Wait time',
      'rude': 'Staff behavior',
      'wrong': 'Order accuracy',
      'frustrat': 'Customer experience',
    };
    
    for (const n of negative) {
      if (complaintMap[n.keyword]) {
        topComplaint = complaintMap[n.keyword];
        break;
      }
    }
    if (!topComplaint) topComplaint = 'Overall experience';
  }
  
  // Determine top positive
  let topPositive = null;
  if (positive.length > 0) {
    const positiveMap: Record<string, string> = {
      'great': 'Overall experience',
      'amazing': 'Overall experience',
      'excellent': 'Overall quality',
      'wonderful': 'Overall experience',
      'love': 'Product/service',
      'best': 'Overall value',
      'perfect': 'Overall experience',
      'friendly': 'Staff behavior',
      'helpful': 'Staff behavior',
      'fast': 'Service speed',
      'quick': 'Service speed',
      'recommend': 'Likelihood to recommend',
    };
    
    for (const p of positive) {
      if (positiveMap[p.keyword]) {
        topPositive = positiveMap[p.keyword];
        break;
      }
    }
    if (!topPositive) topPositive = 'Overall experience';
  }
  
  // Generate recommendation
  let recommendation = null;
  if (topComplaint) {
    const recMap: Record<string, string> = {
      'Wait time': 'Consider adding staff during peak hours to reduce wait times.',
      'Food temperature': 'Implement a temperature check process before serving.',
      'Order accuracy': 'Add a dedicated order verification step before delivery.',
      'Staff behavior': 'Reinforce customer service training for all team members.',
      'Overall experience': 'Review current operations for quality control gaps.',
      'Overall quality': 'Implement more rigorous quality checks.',
      'Customer experience': 'Focus on improving the overall customer journey.',
    };
    recommendation = recMap[topComplaint] || 'Review operations to address the main complaint.';
  } else if (topPositive) {
    recommendation = 'Keep up the great work! Consider highlighting your strengths in marketing.';
  }
  
  // Calculate rating trend (mock - would need historical data)
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  let ratingTrend: 'up' | 'down' | 'stable' = 'stable';
  if (avgRating >= 4.2) ratingTrend = 'up';
  else if (avgRating <= 3.0) ratingTrend = 'down';
  
  // Summary
  const summary = `Analyzed ${reviews.length} reviews. ` +
    `Average rating: ${avgRating.toFixed(1)} stars. ` +
    `${distribution.positive} positive (${Math.round((distribution.positive / reviews.length) * 100)}%), ` +
    `${distribution.neutral} neutral, ` +
    `${distribution.negative} negative (${Math.round((distribution.negative / reviews.length) * 100)}%)).`;
  
  return {
    topComplaint,
    topPositive,
    recommendation,
    ratingTrend,
    summary,
  };
}

export default {
  analyzeKeywordFrequency,
  calculateSentimentDistribution,
  generateBasicInsights,
};