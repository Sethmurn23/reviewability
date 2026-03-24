'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { 
  determineStrategy, 
  calculateSeverity, 
  generateResponse, 
  simulateAutomation,
  defaultSettings,
  regenerateResponse 
} from '../../lib/automation';
import { automationRunner } from '../../lib/automation-runner';

// Initial mock data
const initialReviews = [
  { id: '1', authorName: 'Sarah Johnson', rating: 5, content: 'The team went above and beyond to help me. Will definitely come back!', source: 'google', strategy: 'appreciation', severity: 'low', reason: '5-star review with strong positive language', status: 'auto_replied', draftResponse: 'Thank you so much for your wonderful review!', createdAt: '2026-03-23' },
  { id: '2', authorName: 'Mike Chen', rating: 2, content: 'Waited 45 minutes. Cold food. Very frustrating.', source: 'yelp', strategy: 'recovery', severity: 'high', reason: '2-star review with service complaint', status: 'needs_approval', draftResponse: 'We sincerely apologize for your experience.', createdAt: '2026-03-22' },
  { id: '3', authorName: 'Emily Davis', rating: 4, content: 'Great product overall. Shipping was fast but packaging could use improvement.', source: 'trustpilot', strategy: 'clarification', severity: 'medium', reason: '4-star review with mixed feedback', status: 'draft', draftResponse: 'Thank you for your feedback.', createdAt: '2026-03-21' },
  { id: '4', authorName: 'James Wilson', rating: 1, content: 'Wrong order 3 times. Complete waste of money.', source: 'google', strategy: 'recovery', severity: 'critical', reason: '1-star review with repeated issue', status: 'needs_approval', draftResponse: 'I am deeply sorry for this terrible experience.', createdAt: '2026-03-20' },
  { id: '5', authorName: 'Lisa Anderson', rating: 5, content: 'Exactly what I needed. Fast delivery too!', source: 'google', strategy: 'appreciation', severity: 'low', reason: '5-star review with positive language', status: 'resolved', draftResponse: 'WOW thank you so much!', createdAt: '2026-03-19' },
  { id: '6', authorName: 'Tom Harris', rating: 3, content: 'It was okay. Nothing special but nothing wrong either.', source: 'yelp', strategy: 'clarification', severity: 'medium', reason: '3-star review with neutral feedback', status: 'needs_approval', draftResponse: 'Thank you for your feedback.', createdAt: '2026-03-18' },
];

const severityColors: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
};

const statusLabels: Record<string, { label: string; color: string; icon: string }> = {
  draft: { label: 'Draft', color: '#94a3b8', icon: '✏️' },
  needs_approval: { label: 'Needs Approval', color: '#f59e0b', icon: '⏳' },
  auto_replied: { label: 'Auto-handled', color: '#6366f1', icon: '🤖' },
  resolved: { label: 'Resolved', color: '#22c55e', icon: '✓' },
  failed: { label: 'Failed', color: '#ef4444', icon: '⚠️' },
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [search, setSearch] = useState('');
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Initialize automation
  useState(() => {
    automationRunner.initialize(initialReviews, defaultSettings, 'Your Business');
  });

  // Filter reviews
  const filtered = reviews
    .filter(r => {
      if (starFilter !== 'all' && r.rating !== starFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (search && !r.content.toLowerCase().includes(search.toLowerCase()) && !r.authorName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Group by status
  const needsApproval = filtered.filter(r => r.status === 'needs_approval');
  const autoHandled = filtered.filter(r => r.status === 'auto_replied');
  const allOthers = filtered.filter(r => !['needs_approval', 'auto_replied'].includes(r.status));

  // Stats
  const stats = {
    needsApproval: reviews.filter(r => r.status === 'needs_approval').length,
    autoHandled: reviews.filter(r => r.status === 'auto_replied').length,
    total: reviews.length,
  };

  // Regenerate with modification
  const handleRegenerate = (reviewId: string, modification: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;
    
    const newResponse = regenerateResponse(review.draftResponse || '', modification as any);
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, draftResponse: newResponse } : r
    ));
  };

  // Approve draft
  const handleApprove = (reviewId: string) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, status: 'resolved' } : r
    ));
  };

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 20px' }}>
        <div className="flex flex-between" style={{ marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Reviews Inbox</h1>
            <p className="text-muted">AI-powered review management with automation</p>
          </div>
        </div>

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
        <div className="grid grid-3 mb-4">
          <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setStatusFilter('needs_approval')}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: stats.needsApproval > 0 ? '#f59e0b' : 'var(--text)' }}>{stats.needsApproval}</div>
            <div className="text-muted" style={{ fontSize: '12px' }}>⏳ Needs Approval</div>
          </div>
          <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setStatusFilter('auto_replied')}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#6366f1' }}>{stats.autoHandled}</div>
            <div className="text-muted" style={{ fontSize: '12px' }}>🤖 Auto-Handled</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 800 }}>{stats.total}</div>
            <div className="text-muted" style={{ fontSize: '12px' }}>Total Reviews</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="flex gap-4 flex-between" style={{ flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: '200px' }}
            />
            
            <div className="flex gap-2">
              <select value={starFilter as any} onChange={(e) => setStarFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))} style={{ width: 'auto' }}>
                <option value="all">All Stars</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
                <option value="all">All Status</option>
                <option value="needs_approval">Needs Approval</option>
                <option value="auto_replied">Auto-Handled</option>
                <option value="draft">Draft</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Needs Approval Section */}
        {needsApproval.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#f59e0b' }}>⏳</span> Needs Approval ({needsApproval.length})
            </h2>
            
            {needsApproval.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review}
                onApprove={handleApprove}
                onRegenerate={handleRegenerate as any}
              />
            ))}
          </div>
        )}

        {/* Auto-Handled Section with Preview */}
        {autoHandled.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#6366f1' }}>🤖</span> Auto-Handled Preview ({autoHandled.length})
            </h2>
            <p className="text-muted" style={{ fontSize: '13px', marginBottom: '16px' }}>
              These would have been automatically posted to the review platforms:
            </p>
            
            {autoHandled.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review}
                showAutoPreview
              />
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
              <ReviewCard 
                key={review.id} 
                review={review}
                onApprove={handleApprove}
                onRegenerate={handleRegenerate as any}
              />
            ))
          ) : (
            <div className="card text-center" style={{ padding: '40px' }}>
              <p className="text-muted">No reviews match your current filters</p>
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setSearch('');
                  setStarFilter('all');
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

function ReviewCard({ 
  review, 
  onApprove, 
  onRegenerate,
  showAutoPreview = false 
}: { 
  review: any; 
  onApprove?: (id: string) => void;
  onRegenerate?: (id: string, modification: string) => void;
  showAutoPreview?: boolean;
}) {
  const [response, setResponse] = useState(review.draftResponse || '');
  
  const status = statusLabels[review.status] || statusLabels.draft;
  
  return (
    <div className="card" style={{ marginBottom: '16px', borderLeft: `4px solid ${severityColors[review.severity || 'low']}` }}>
      {/* Auto-preview banner */}
      {showAutoPreview && (
        <div style={{ 
          background: 'rgba(99, 102, 241, 0.1)', 
          padding: '8px 12px', 
          borderRadius: '6px', 
          marginBottom: '12px',
          fontSize: '12px',
          color: '#6366f1'
        }}>
          💡 This would have been automatically posted
        </div>
      )}
      
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
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            background: `${status.color}20`,
            color: status.color,
          }}>
            {status.icon} {status.label}
          </span>
        </div>
      </div>

      {/* Review Content */}
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
            <strong style={{ color: '#22c55e' }}>Strategy:</strong> {(review.strategy || 'clarification').toUpperCase()}
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
          {showAutoPreview ? 'Auto-generated response:' : 'Suggested Response:'}
        </label>
        <textarea 
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          style={{ width: '100%', minHeight: '80px', marginBottom: '12px', fontSize: '14px' }}
        />
        
        {/* Regenerate buttons */}
        {onRegenerate && (review.status === 'needs_approval' || review.status === 'draft') && (
          <div className="flex gap-2" style={{ marginBottom: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => onRegenerate(review.id, 'more_professional')}>
              More Professional
            </button>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => onRegenerate(review.id, 'more_friendly')}>
              More Friendly
            </button>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => onRegenerate(review.id, 'shorter')}>
              Shorter
            </button>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => onRegenerate(review.id, 'stronger_apology')}>
              Stronger Apology
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-between">
        <div className="flex gap-2">
          {review.status === 'needs_approval' || review.status === 'draft' ? (
            <>
              {onApprove && (
                <button className="btn btn-primary" onClick={() => onApprove(review.id)}>✓ Approve Draft</button>
              )}
              <button className="btn btn-secondary">Save Response</button>
            </>
          ) : review.status === 'auto_replied' ? (
            <span style={{ color: '#6366f1', fontSize: '13px' }}>🤖 Auto-handled</span>
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