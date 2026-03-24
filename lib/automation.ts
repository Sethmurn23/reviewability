// lib/automation.ts - Real automation engine
// Executes automation rules against reviews

import type { Review } from './integrations/types';

// Default automation settings
export interface AutomationSettings {
  autoReply5Star: boolean;
  autoReply4Star: boolean;
  requireApproval1to3Star: boolean;
  businessHoursOnly: boolean;
  ownerVoice: boolean;
  toneDefault: 'professional' | 'friendly' | 'apologetic';
}

export const defaultSettings: AutomationSettings = {
  autoReply5Star: true,
  autoReply4Star: false,
  requireApproval1to3Star: true,
  businessHoursOnly: false,
  ownerVoice: false,
  toneDefault: 'professional',
};

// Response templates per strategy + tone
const responseTemplates = {
  recovery: {
    professional: "Thank you for bringing this to our attention. We take full accountability for what happened. This is not our standard of service and we've immediately implemented corrective measures to ensure this doesn't happen again.",
    friendly: "Oh no - we're SO sorry about this! That's NOT the experience we want. We're taking this super seriously and want to make it right.",
    apologetic: "I personally apologize for your experience. You deserved so much better and I'm devastated we failed. Please contact me directly so we can fix this.",
  },
  appreciation: {
    professional: "Thank you for your wonderful review! We're thrilled to hear you had a great experience. Your positive feedback motivates our entire team.",
    friendly: "WOW - thank you SO much! We're absolutely thrilled your visit was awesome!",
    apologetic: "We're deeply grateful for your kind words. Your positive experience is exactly what we strive for every day.",
  },
  clarification: {
    professional: "Thank you for your feedback. We appreciate you sharing your experience. We'd welcome the opportunity to discuss any specific concerns.",
    friendly: "Thanks for the feedback! We'd love to hear more about what could have been better.",
    apologetic: "Thank you for your honest feedback. We're sorry if we didn't fully meet your expectations.",
  },
  defense: {
    professional: "Thank you for sharing your perspective. We take all feedback seriously and want to address your concerns. We believe there may be some misunderstanding.",
    friendly: "Thanks for sharing your thoughts. We respect that you had a different experience.",
    apologetic: "Thank you for your feedback about our business. We understand you're frustrated and we take that seriously.",
  },
};

// Analyze review content for keywords
export function analyzeKeywords(content: string): { positive: string[]; negative: string[] } {
  const lower = content.toLowerCase();
  
  const positiveKeywords = [
    { word: 'great', count: 0 },
    { word: 'amazing', count: 0 },
    { word: 'excellent', count: 0 },
    { word: 'wonderful', count: 0 },
    { word: 'love', count: 0 },
    { word: 'best', count: 0 },
    { word: 'perfect', count: 0 },
    { word: 'fantastic', count: 0 },
    { word: 'outstanding', count: 0 },
    { word: 'friendly', count: 0 },
    { word: 'helpful', count: 0 },
    { word: 'fast', count: 0 },
    { word: 'quick', count: 0 },
  ];
  
  const negativeKeywords = [
    { word: 'terrible', count: 0 },
    { word: 'worst', count: 0 },
    { word: 'horrible', count: 0 },
    { word: 'awful', count: 0 },
    { word: 'disappointing', count: 0 },
    { word: 'bad', count: 0 },
    { word: 'cold', count: 0 },
    { word: 'slow', count: 0 },
    { word: 'rude', count: 0 },
    { word: 'wrong', count: 0 },
    { word: 'wait', count: 0 },
    { word: 'frustrat', count: 0 },
  ];
  
  positiveKeywords.forEach(k => {
    if (lower.includes(k.word)) k.count++;
  });
  
  negativeKeywords.forEach(k => {
    if (lower.includes(k.word)) k.count++;
  });
  
  return {
    positive: positiveKeywords.filter(k => k.count > 0).map(k => k.word),
    negative: negativeKeywords.filter(k => k.count > 0).map(k => k.word),
  };
}

// Determine review strategy based on rating + content
export function determineStrategy(rating: number, content: string): string {
  const lower = content.toLowerCase();
  
  // Defense override for aggressive language
  const defenseWords = ['unfair', 'wrong', 'fake', 'lie', 'scam', 'cheat', 'theft'];
  if (defenseWords.some(w => lower.includes(w))) {
    return 'defense';
  }
  
  // Rating-based strategy
  if (rating >= 4) return 'appreciation';
  if (rating <= 2) return 'recovery';
  
  // Content-based for mid-ratings
  const negWords = ['terrible', 'worst', 'horrible', 'awful', 'disappointing', 'bad'];
  const posWords = ['great', 'amazing', 'excellent', 'wonderful', 'love', 'best'];
  
  if (negWords.some(w => lower.includes(w))) return 'recovery';
  if (posWords.some(w => lower.includes(w))) return 'appreciation';
  
  return 'clarification';
}

// Calculate severity based on rating + content
export function calculateSeverity(rating: number, content: string): 'critical' | 'high' | 'medium' | 'low' {
  const lower = content.toLowerCase();
  
  // Critical: 1 star OR multiple complaints
  if (rating === 1) return 'critical';
  if (rating === 2 && (lower.includes('never') || lower.includes('worst'))) return 'critical';
  
  // High: 1-2 stars with complaints
  if (rating <= 2) return 'high';
  
  // Medium: 3 stars OR mixed content
  if (rating === 3) return 'medium';
  if (lower.includes('but') && (lower.includes('good') || lower.includes('bad'))) return 'medium';
  
  // Low: 4-5 stars positive
  return 'low';
}

// Generate response for a review
export function generateResponse(
  review: { rating: number; content: string; authorName?: string },
  businessName: string,
  tone: 'professional' | 'friendly' | 'apologetic'
): string {
  const strategy = determineStrategy(review.rating, review.content);
  const template = responseTemplates[strategy][tone];
  
  let response = template.replace(/{business}/g, businessName);
  
  // Add specific mention if content has specific complaints/praises
  const lower = review.content.toLowerCase();
  
  if (lower.includes('service') || lower.includes('staff')) {
    response = response.replace('.', ' Our team is committed to exceptional service.');
  }
  if (lower.includes('wait') || lower.includes('time')) {
    response = response.replace('.', ' We are working on improving our wait times.');
  }
  if (lower.includes('food') || lower.includes('order')) {
    response = response.replace('.', ' Quality is our top priority.');
  }
  
  return response;
}

// Execute automation rules on a review
export function processReviewAutomation(
  review: Review,
  settings: AutomationSettings = defaultSettings,
  businessName: string = 'our business'
): { status: Review['status']; response?: string } {
  const strategy = determineStrategy(review.rating, review.content);
  const severity = calculateSeverity(review.rating, review.content);
  
  // Check if should auto-reply
  let shouldAutoReply = false;
  
  if (review.rating >= 5 && settings.autoReply5Star) {
    shouldAutoReply = true;
  } else if (review.rating === 4 && settings.autoReply4Star) {
    shouldAutoReply = true;
  } else if (review.rating <= 3 && settings.requireApproval1to3Star) {
    shouldAutoReply = false;
  }
  
  // Check business hours if enabled
  if (settings.businessHoursOnly) {
    const hour = new Date().getHours();
    if (hour < 9 || hour > 17) {
      shouldAutoReply = false;
    }
  }
  
  if (shouldAutoReply) {
    const response = generateResponse(
      { rating: review.rating, content: review.content, authorName: review.authorName },
      businessName,
      settings.toneDefault
    );
    
    return { status: 'auto_replied', response };
  }
  
  return { status: 'needs_approval' };
}

// Run simulation - process all reviews through automation rules
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function simulateAutomation(
  reviews: any[],
  settings: AutomationSettings = defaultSettings,
  businessName: string = 'Test Business'
): {
  processed: Review[];
  stats: {
    autoHandled: number;
    needsApproval: number;
    byRating: Record<number, number>;
  };
} {
  const processed = reviews.map(review => {
    const result = processReviewAutomation(review, settings, businessName);
    
    return {
      ...review,
      status: result.status,
      draftResponse: result.response || review.draftResponse,
      strategy: review.strategy || determineStrategy(review.rating, review.content),
      severity: review.severity || calculateSeverity(review.rating, review.content),
    };
  });
  
  const stats = {
    autoHandled: processed.filter(r => r.status === 'auto_replied').length,
    needsApproval: processed.filter(r => r.status === 'needs_approval').length,
    byRating: {
      5: processed.filter(r => r.rating === 5).length,
      4: processed.filter(r => r.rating === 4).length,
      3: processed.filter(r => r.rating === 3).length,
      2: processed.filter(r => r.rating === 2).length,
      1: processed.filter(r => r.rating === 1).length,
    },
  };
  
  return { processed, stats };
}

// Regenerate with specific modifications
export function regenerateResponse(
  originalResponse: string,
  modification: 'more_professional' | 'more_friendly' | 'shorter' | 'stronger_apology',
  businessName: string = 'our business'
): string {
  switch (modification) {
    case 'more_professional':
      return originalResponse
        .replace(/Oh no/gi, 'We regret')
        .replace(/SO sorry/gi, 'sincerely apologize')
        .replace(/WOW/gi, 'We are grateful')
        .replace(/awesome/gi, 'excellent');
        
    case 'more_friendly':
      return originalResponse
        .replace(/Thank you/gi, 'Thank you so much')
        .replace(/regret/gi, 'are sorry')
        .replace(/We are grateful/gi, 'WOW, we really appreciate');
        
    case 'shorter':
      // Truncate to first 2 sentences
      const sentences = originalResponse.split(/[.!?]+/);
      return sentences.slice(0, 2).join('. ').trim() + '.';
      
    case 'stronger_apology':
      return originalResponse
        .replace(/apologize/gi, 'deeply apologize')
        .replace(/sorry/gi, 'extremely sorry')
        .replace(/regret/gi, 'deeply regret')
        .replace(/understand/gi, 'fully understand');
        
    default:
      return originalResponse;
  }
}

export default {
  defaultSettings,
  determineStrategy,
  calculateSeverity,
  generateResponse,
  processReviewAutomation,
  simulateAutomation,
  regenerateResponse,
  analyzeKeywords,
};