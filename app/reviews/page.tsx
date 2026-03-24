'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';

// Review type for normalized reviews
interface Review {
  id: string;
  authorName: string;
  rating: number;
  title?: string;
  content: string;
  source: string; // google, yelp, trustpilot, manual
  sourceId?: string;
  locationId?: string;
  sentiment?: string;
  strategy?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  reason?: string;
  status: 'draft' | 'needs_approval' | 'auto_replied' | 'resolved' | 'failed';
  draftResponse?: string;
  createdAt: string;
  platformReplyId?: string;
  responsePostedAt?: string;
}

// Mock reviews with normalized data
const mockReviews: Review[] = [
  { id: '1', authorName: 'Sarah Johnson', rating: 5, title: 'Amazing service!', content: 'The team went above and beyond to help me. Will definitely come back!', source: 'google', sentiment: 'positive', strategy: 'appreciation', severity: 'low', reason: '5-star review with strong positive language', status: 'auto_replied', draftResponse: 'Thank you so much for your wonderful review! We are thrilled to hear you had a great experience.', createdAt: '2026-03-23' },
  { id: '2', authorName: 'Mike Chen', rating: 2, title: 'Disappointed', content: 'Waited 45 minutes. Cold food. Very frustrating.', source: 'yelp', sentiment: 'negative', strategy: 'recovery', severity: 'high', reason: '1-star review with service complaint', status: 'needs_approval', draftResponse: 'We sincerely apologize for your experience. This falls well below our standards.', createdAt: '2026-03-22' },
  { id: '3', authorName: 'Emily Davis', rating: 4, content: 'Great product overall. Shipping was fast but packaging could use improvement.', source: 'trustpilot', sentiment: 'neutral', strategy: 'clarification', severity: 'medium', reason: '4-star review with mixed feedback', status: 'draft', draftResponse: 'Thank you for your feedback. We are glad shipping was fast.', createdAt: '2026-03-21' },
  { id: '4', authorName: 'James Wilson', rating: 1, title: 'Never ordering again', content: 'Wrong order 3 times. Complete waste of money.', source: 'google', sentiment: 'negative', strategy: 'recovery', severity: 'critical', reason: '1-star review with repeated issue', status: 'needs_approval', draftResponse: 'I am deeply sorry for this terrible experience. This is unacceptable.', createdAt: '2026-03-20' },
  { id: '5', authorName: 'Lisa Anderson', rating: 5, title: 'Perfect!', content: 'Exactly what I needed. Fast delivery too!', source: 'google', sentiment: 'positive', strategy: 'appreciation', severity: 'low', reason: '5-star review with strong positive language', status: 'resolved', draftResponse: 'WOW thank you so much! We are thrilled everything was perfect!', createdAt: '2026-03-19' },
  { id: '6', authorName: 'Tom Harris', rating: 3, title: 'Average', content: 'It was okay. Nothing special but nothing wrong either.', source: 'yelp', sentiment: 'neutral', strategy: 'clarification', severity: 'medium', reason: '3-star review with neutral feedback', status: 'needs_approval', draftResponse: 'Thank you for your feedback. We appreciate your honesty.', createdAt: '2026-03-18' },
  { id: '7', authorName: 'Anna Martinez', rating: 2, title: 'Not happy', content: 'Staff was rude. Waited forever. Very disappointing.', source: 'google', sentiment: 'negative', strategy: 'recovery', severity: 'high', reason: '2-star review with service complaint', status: 'failed', draftResponse: 'We apologize for your experience. This is not our standard.', createdAt: '2026-03-17' },
];

const severityColors: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
};

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: '#94a3b8' },
  needs_approval: { label: 'Needs Approval', color: '#f59e0b' },
  auto_replied: { label: 'Auto-Replied', color: '#6366f1' },
  resolved: { label: 'Resolved', color: '#22c55e' },
  failed: { label: 'Failed', color: '#ef4444' },
};

const strategyLabels: Record<string, string> = {
  recovery: 'Recovery',
  appreciation: 'Appreciation',
  clarification: 'Clarification',
  defense: 'Defense',
};

export default function ReviewsPage() {
  const [reviews] = useState<Review[]>(mockReviews);
  const [search, setSearch] = useState('');
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [strategyFilter, setStrategyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Calculate summary stats
  const stats = {
    needsApproval: reviews.filter(r => r.status === 'needs_approval').length,
    autoRepliedToday: reviews.filter(r => r.status === 'auto_replied').length,
    highSeverity: reviews.filter(r => r.severity === 'high' || r.severity === 'critical').length,
    total: reviews.length,
  };

  // Filter and sort reviews
  const filtered = reviews
    .filter(r => {
      if (starFilter !== 'all' && r.rating !== starFilter) return false;
      if (severityFilter !== 'all' && r.severity !== severityFilter) return false;
      if (strategyFilter !== 'all' && r.strategy !== strategyFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (search && !r.content.toLowerCase().includes(search.toLowerCase()) && !r.authorName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'severity') {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return (severityOrder[b.severity || 'low'] || 0) - (severityOrder[a.severity || 'low'] || 0);
      }
      if (sortBy === 'rating_asc') return a.rating - b.rating;
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      return 0;
    });

  // Separate needs approval
  const needsApproval = filtered.filter(r => r.status === 'needs_approval');

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Reviews Inbox</h1>
        <p className="text-muted" style={{ marginBottom: '24px' }}>AI-powered review analysis with response drafts</p>

        {/* Helper Text */}
        <div style={{ 
          background: 'rgba(99, 102, 241, 0.1)', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          marginBottom: '24px',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}>
          💡 AI drafts are editable before approval. Auto-posting will be available once integrations are connected.
        </div>

        {/* Summary Row */}
        <div className="grid grid-4 mb-4">
          <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setStatusFilter('needs_approval')}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: stats.needsApproval > 0 ? '#f59e0b' : 'var(--text)' }}>{stats.needsApproval}</div>
            <div className="text-muted" style={{ fontSize: '12px' }}>Needs Approval</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#6366f1' }}>{stats.autoRepliedToday}</div>
            <div className="text-muted" style={{ fontSize: '12px' }}>Auto-Replied Today</div>
          </div>
          <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setSeverityFilter('high')}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#ef4444' }}>{stats.highSeverity}</div>
            <div className="text-muted" style={{ fontSize: '12px' }}>High Severity</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 800 }}>{stats.total}</div>
            <div className="text-muted" style={{ fontSize: '12px' }}>Total Reviews</div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="card mb-4">
          <div className="flex gap-4 flex-between" style={{ flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: '200px' }}
            />
            
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              <select value={starFilter as any} onChange={(e) => setStarFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))} style={{ width: 'auto' }}>
                <option value="all">All Stars</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              
              <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} style={{ width: 'auto' }}>
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <select value={strategyFilter} onChange={(e) => setStrategyFilter(e.target.value)} style={{ width: 'auto' }}>
                <option value="all">All Strategy</option>
                <option value="recovery">Recovery</option>
                <option value="appreciation">Appreciation</option>
                <option value="clarification">Clarification</option>
                <option value="defense">Defense</option>
              </select>
              
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
                <option value="all">All Status</option>
                <option value="needs_approval">Needs Approval</option>
                <option value="draft">Draft</option>
                <option value="auto_replied">Auto-Replied</option>
                <option value="resolved">Resolved</option>
                <option value="failed">Failed</option>
              </select>
              
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: 'auto' }}>
                <option value="newest">Newest First</option>
                <option value="severity">Highest Severity</option>
                <option value="rating_desc">Highest Rating</option>
                <option value="rating_asc">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Needs Approval Queue */}
        {needsApproval.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#f59e0b' }}>⚠️</span> Needs Approval ({needsApproval.length})
            </h2>
            
            {needsApproval.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} compact />
            ))}
          </div>
        )}

        {/* All Reviews */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
            All Reviews ({filtered.length})
          </h2>
          
          {filtered.length > 0 ? (
            filtered.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <div className="card text-center" style={{ padding: '40px' }}>
              <p className="text-muted" style={{ fontSize: '16px' }}>No reviews match your current filters</p>
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setSearch('');
                  setStarFilter('all');
                  setSeverityFilter('all');
                  setStrategyFilter('all');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ReviewCard({ review, compact = false }: { review: Review; compact?: boolean }) {
  const [response, setResponse] = useState(review.draftResponse || '');
  
  if (compact) {
    return (
      <div className="card" style={{ marginBottom: '12px', borderLeft: `4px solid ${severityColors[review.severity || 'low']}` }}>
        <div className="flex flex-between">
          <div className="flex gap-2" style={{ alignItems: 'center' }}>
            <span style={{ color: '#f59e0b', fontSize: '14px' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
            <span style={{ fontSize: '13px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {review.content}
            </span>
          </div>
          <div className="flex gap-2" style={{ alignItems: 'center' }}>
            <span style={{
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 600,
              background: `${severityColors[review.severity || 'low']}20`,
              color: severityColors[review.severity || 'low'],
            }}>
              {(review.severity || 'low').toUpperCase()}
            </span>
            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Review Now</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: '16px', borderLeft: `4px solid ${severityColors[review.severity || 'low']}` }}>
      {/* Header */}
      <div className="flex flex-between" style={{ marginBottom: '12px' }}>
        <div className="flex gap-2" style={{ alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
          }}>
            {review.authorName.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{review.authorName}</div>
            <div className="text-muted" style={{ fontSize: '12px' }}>
              {new Date(review.createdAt).toLocaleDateString()} • {review.source}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2" style={{ alignItems: 'center' }}>
          <span style={{ color: '#f59e0b', fontSize: '18px' }}>
            {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
          </span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            background: `${severityColors[review.severity || 'low']}20`,
            color: severityColors[review.severity || 'low'],
          }}>
            {(review.severity || 'low').toUpperCase()}
          </span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            background: `${statusLabels[review.status].color}20`,
            color: statusLabels[review.status].color,
          }}>
            {statusLabels[review.status].label}
          </span>
        </div>
      </div>

      {/* Review Content */}
      {review.title && (
        <div style={{ fontWeight: 600, marginBottom: '8px' }}>{review.title}</div>
      )}
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
        {review.content}
      </p>

      {/* AI Analysis */}
      <div style={{ 
        background: 'var(--bg)', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '16px',
        border: '1px solid var(--border)'
      }}>
        <div style={{ fontSize: '13px', marginBottom: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span>
            <strong style={{ color: '#22c55e' }}>Strategy:</strong> {strategyLabels[review.strategy || 'clarification']}
          </span>
          <span>
            <strong style={{ color: severityColors[review.severity || 'low'] }}>Severity:</strong> {(review.severity || 'low').toUpperCase()}
          </span>
          <span className="text-muted">
            <strong>Reason:</strong> {review.reason}
          </span>
        </div>
        
        {/* Suggested AI Response */}
        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
          Suggested AI Response:
        </label>
        <textarea 
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          style={{ width: '100%', minHeight: '100px', marginBottom: '12px', fontSize: '14px' }}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-between">
        <div className="flex gap-2">
          {review.status === 'needs_approval' || review.status === 'draft' ? (
            <>
              <button className="btn btn-primary">✓ Approve Draft</button>
              <button className="btn btn-secondary">Save Response</button>
              <button className="btn btn-secondary">↻ Regenerate</button>
            </>
          ) : review.status === 'auto_replied' ? (
            <span style={{ color: '#6366f1', fontSize: '13px' }}>✓ Auto-replied</span>
          ) : review.status === 'resolved' ? (
            <span style={{ color: 'var(--success)', fontSize: '13px' }}>✓ Resolved</span>
          ) : (
            <span style={{ color: '#ef4444', fontSize: '13px' }}>⚠️ Failed - Retry</span>
          )}
          <button className="btn btn-secondary">Skip</button>
        </div>
      </div>
    </div>
  );
}