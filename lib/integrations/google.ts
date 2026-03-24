// Google Business Profile integration placeholder
// TODO: Implement when Google Business Profile API credentials are available
// 
// Required setup:
// 1. Google Cloud Project with Google My Business API enabled
// 2. OAuth 2.0 credentials for user authentication
// 3. Business account verification
//
// Reference: https://developers.google.com/my-business

import type { NormalizedReview, Location } from './types';

/**
 * Fetch reviews from Google Business Profile for a location
 * TODO: Implement with Google My Business API
 */
export async function fetchGoogleReviews(locationId: string): Promise<NormalizedReview[]> {
  // Placeholder - will be implemented with real API
  console.log('TODO: fetchGoogleReviews for location:', locationId);
  
  return [];
}

/**
 * Normalize a Google review to our normalized format
 * TODO: Implement
 */
export function normalizeGoogleReview(googleReview: any, locationId: string, businessId: string): NormalizedReview {
  // Placeholder - will be implemented with real API response shape
  return {
    id: `google_${googleReview.reviewId}`,
    businessId,
    source: 'google',
    sourceId: googleReview.reviewId,
    sourceReviewUrl: googleReview.reviewId,
    locationId,
    authorName: googleReview.reviewer?.displayName || 'Anonymous',
    authorAvatar: googleReview.reviewer?.profilePhotoUrl,
    rating: googleReview.starRating || 3,
    title: googleReview.headline,
    content: googleReview.comment,
    originalContent: googleReview.comment,
    reviewDate: googleReview.createTime,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
  };
}

/**
 * Post a reply to a Google review
 * TODO: Implement with Google My Business API
 */
export async function createGoogleReply(
  reviewId: string, 
  replyContent: string
): Promise<{ success: boolean; platformReplyId?: string; error?: string }> {
  // Placeholder
  console.log('TODO: createGoogleReply for review:', reviewId, 'content:', replyContent);
  
  return {
    success: false,
    error: 'Not yet implemented - requires Google API credentials',
  };
}

/**
 * List Google Business locations for the connected account
 * TODO: Implement
 */
export async function listGoogleLocations(): Promise<Location[]> {
  // Placeholder - will list locations once API is connected
  console.log('TODO: listGoogleLocations');
  
  return [];
}

/**
 * Check if Google integration is configured and ready
 */
export function isGoogleConfigured(): boolean {
  // TODO: Check for Google API credentials in environment
  return false;
}

/**
 * Get OAuth URL for Google authentication
 */
export function getGoogleAuthUrl(): string {
  // TODO: Generate proper OAuth URL
  return '#google-auth-not-configured';
}

// Integration status helpers
export const GOOGLE_INTEGRATION_STATUS = {
  COMING_SOON: 'coming_soon',
  NOT_CONNECTED: 'not_connected', 
  CONNECTED: 'connected',
  ERROR: 'error',
} as const;