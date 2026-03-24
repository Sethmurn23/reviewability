// Google Business Profile integration placeholder
// TODO: Implement when Google Business Profile API credentials are available

/**
 * Fetch reviews from Google Business Profile for a location
 */
export async function fetchGoogleReviews(locationId: string): Promise<any> {
  console.log('TODO: fetchGoogleReviews for location:', locationId);
  return [];
}

/**
 * Normalize a Google review to our normalized format
 */
export function normalizeGoogleReview(googleReview: any, locationId: string, businessId: string): any {
  return {};
}

/**
 * Post a reply to a Google review
 */
export async function createGoogleReply(reviewId: string, replyContent: string): Promise<any> {
  console.log('TODO: createGoogleReply for review:', reviewId);
  return { success: false, error: 'Not yet implemented' };
}

/**
 * List Google Business locations
 */
export async function listGoogleLocations(): Promise<any> {
  console.log('TODO: listGoogleLocations');
  return [];
}

export function isGoogleConfigured(): boolean {
  return false;
}

export function getGoogleAuthUrl(): string {
  return '#google-auth-not-configured';
}

export const GOOGLE_INTEGRATION_STATUS = {
  COMING_SOON: 'coming_soon',
  NOT_CONNECTED: 'not_connected', 
  CONNECTED: 'connected',
  ERROR: 'error',
};
