// lib/automation-runner.ts - Continuous automation loop
// Runs automation logic automatically

import type { Review } from './integrations/types';
import { 
  processReviewAutomation, 
  defaultSettings, 
  simulateAutomation 
} from './automation';

// Activity tracking
export interface Activity {
  id: string;
  type: 'auto_replied' | 'flagged' | 'regenerated' | 'insight' | 'approved' | 'manual_response';
  reviewId?: string;
  message: string;
  timestamp: string;
  details?: any;
}

class AutomationRunner {
  private activities: Activity[] = [];
  private lastRun: string | null = null;
  private processedCount: number = 0;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  // Initialize with reviews and run automation
  initialize(reviews: Review[], settings = defaultSettings, businessName = 'Your Business') {
    this.processedCount = 0;
    this.activities = [];
    
    const result = simulateAutomation(reviews, settings, businessName);
    
    this.lastRun = new Date().toISOString();
    this.processedCount = result.processed.length;
    
    // Log activities for each review
    result.processed.forEach(review => {
      if (review.status === 'auto_replied') {
        this.addActivity({
          type: 'auto_replied',
          reviewId: review.id,
          message: `Auto-replied to ${review.rating}-star review from ${review.authorName}`,
          timestamp: new Date().toISOString(),
          details: { rating: review.rating, response: review.draftResponse?.substring(0, 50) }
        });
      } else if (review.status === 'needs_approval') {
        this.addActivity({
          type: 'flagged',
          reviewId: review.id,
          message: `Flagged for approval: ${review.authorName}'s ${review.rating}-star review`,
          timestamp: new Date().toISOString(),
          details: { rating: review.rating, severity: review.severity }
        });
      }
    });
    
    return result;
  }

  // Start continuous automation loop
  startAutoRun(
    getReviews: () => Review[], 
    onUpdate: (reviews: Review[], activities: Activity[]) => void,
    intervalMs: number = 30000
  ) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Run immediately
    this.runOnce(getReviews(), onUpdate);
    
    // Then on interval
    this.intervalId = setInterval(() => {
      this.runOnce(getReviews(), onUpdate);
    }, intervalMs);
  }

  // Stop automation loop
  stopAutoRun() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  // Run automation once
  private runOnce(
    reviews: Review[], 
    onUpdate: (reviews: Review[], activities: Activity[]) => void
  ) {
    const result = simulateAutomation(reviews, defaultSettings, 'Your Business');
    this.lastRun = new Date().toISOString();
    this.processedCount = result.processed.length;
    
    onUpdate(result.processed, this.activities);
  }

  // Add an activity
  addActivity(activity: Omit<Activity, 'id'>) {
    const newActivity: Activity = {
      ...activity,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    this.activities.unshift(newActivity); // Add to beginning
    
    // Keep only last 20 activities
    if (this.activities.length > 20) {
      this.activities = this.activities.slice(0, 20);
    }
  }

  // Get status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      processedCount: this.processedCount,
      activities: this.activities.slice(0, 10),
    };
  }

  // Get weekly summary
  getWeeklySummary(reviews: Review[]) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weekReviews = reviews.filter(r => new Date(r.createdAt) >= weekAgo);
    const autoHandled = weekReviews.filter(r => r.status === 'auto_replied').length;
    const needsApproval = weekReviews.filter(r => r.status === 'needs_approval').length;
    const resolved = weekReviews.filter(r => r.status === 'resolved').length;
    
    // Calculate rating trend (mock - compare first half vs second half)
    const sorted = [...weekReviews].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const mid = Math.floor(sorted.length / 2);
    const firstHalf = sorted.slice(0, mid);
    const secondHalf = sorted.slice(mid);
    
    const firstAvg = firstHalf.length > 0 
      ? firstHalf.reduce((sum, r) => sum + r.rating, 0) / firstHalf.length 
      : 0;
    const secondAvg = secondHalf.length > 0 
      ? secondHalf.reduce((sum, r) => sum + r.rating, 0) / secondHalf.length 
      : 0;
    
    const trend = secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'stable';
    
    return {
      totalProcessed: weekReviews.length,
      autoHandled,
      needsApproval,
      resolved,
      ratingTrend: trend,
      avgRating: weekReviews.length > 0 
        ? (weekReviews.reduce((sum, r) => sum + r.rating, 0) / weekReviews.length).toFixed(1)
        : '0',
    };
  }
}

// Singleton instance
export const automationRunner = new AutomationRunner();

export default automationRunner;