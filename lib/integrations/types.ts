// Integration types for future platform connectors
// Currently supports: Google Business Profile (planned)

export interface IntegrationConfig {
  platform: string;
  status: 'connected' | 'not_connected' | 'coming_soon';
  connectedAt?: string;
  lastSyncAt?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  platformId: string;
}

// Normalized review model - single source of truth for all reviews
export interface NormalizedReview {
  // Core identity
  id: string;
  businessId: string;
  
  // Source information
  source: 'google' | 'yelp' | 'trustpilot' | 'facebook' | 'manual';
  sourceId: string; // Platform's review ID
  sourceReviewUrl: string;
  locationId?: string; // For multi-location businesses
  
  // Review content
  authorName: string;
  authorUrl?: string;
  authorAvatar?: string;
  rating: number; // 1-5
  title?: string;
  content: string;
  originalContent?: string; // Before any AI processing
  
  // Timestamps
  reviewDate: string;
  createdAt: string;
  updatedAt: string;
  
  // AI Analysis
  sentiment?: 'positive' | 'negative' | 'neutral';
  sentimentScore?: number;
  strategy?: 'recovery' | 'appreciation' | 'clarification' | 'defense';
  severity?: 'critical' | 'high' | 'medium' | 'low';
  reason?: string;
  topics?: string[];
  language?: string;
  
  // Response handling
  status: 'draft' | 'needs_approval' | 'auto_replied' | 'resolved' | 'failed';
  draftResponse?: string;
  approvedResponse?: string;
  
  // Platform-specific reply tracking
  platformReplyId?: string;
  responsePostedAt?: string;
  responseMethod?: 'api' | 'manual' | 'email';
  
  // Error tracking
  errorMessage?: string;
  retryCount?: number;
}

// Review filter/search options
export interface ReviewFilters {
  search?: string;
  starRating?: number | 'all';
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'all';
  strategy?: 'recovery' | 'appreciation' | 'clarification' | 'defense' | 'all';
  status?: 'draft' | 'needs_approval' | 'auto_replied' | 'resolved' | 'failed' | 'all';
  source?: 'google' | 'yelp' | 'trustpilot' | 'facebook' | 'manual' | 'all';
  dateFrom?: string;
  dateTo?: string;
}

export type ReviewSortBy = 'newest' | 'oldest' | 'severity' | 'rating_desc' | 'rating_asc';

// Batch operations
export interface BatchOperation {
  reviewIds: string[];
  action: 'approve' | 'reject' | 'regenerate' | 'archive';
  performedBy: string;
  performedAt: string;
}