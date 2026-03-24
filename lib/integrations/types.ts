// Integration types for future platform connectors
// Review type for normalized reviews

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  title?: string;
  content: string;
  source: string;
  sentiment?: string;
  strategy?: string;
  severity?: string;
  reason?: string;
  status: string;
  draftResponse?: string;
  createdAt: string;
}

export interface ReviewFilters {
  search?: string;
  starRating?: number | 'all';
  severity?: string | 'all';
  strategy?: string | 'all';
  status?: string | 'all';
}

export interface Location {
  id: string;
  name: string;
  address: string;
  platformId: string;
}

export interface IntegrationConfig {
  platform: string;
  status: string;
  connectedAt?: string;
  lastSyncAt?: string;
}

export type ReviewSortBy = 'newest' | 'oldest' | 'severity' | 'rating_desc' | 'rating_asc';

export interface BatchOperation {
  reviewIds: string[];
  action: string;
  performedBy: string;
  performedAt: string;
}