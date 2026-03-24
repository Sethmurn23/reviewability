'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import ToggleSwitch from '../../components/ToggleSwitch';

const mockReviews = [
  { id: '1', authorName: 'Sarah Johnson', rating: 5, title: 'Amazing service!', content: 'The team went above and beyond to help me.', source: 'Google', sentiment: 'positive', strategy: 'appreciation', severity: 'low', reason: '5-star review with strong positive language', draftResponse: 'Thank you so much for your wonderful review! We are thrilled to hear you had a great experience.', responseStatus: 'draft', createdAt: '2026-03-23' },
  { id: '2', authorName: 'Mike Chen', rating: 2, title: 'Disappointed', content: 'Waited 45 minutes. Cold food. Very frustrating.', source: 'Yelp', sentiment: 'negative', strategy: 'recovery', severity: 'high', reason: '1-star review with service complaint', draftResponse: 'We sincerely apologize for your experience. This falls well below our standards.', responseStatus: 'pending', createdAt: '2026-03-22' },
  { id: '3', authorName: 'Emily Davis', rating: 4, content: 'Great product overall. Shipping was fast but packaging could use improvement.', source: 'Trustpilot', sentiment: 'neutral', strategy: 'clarification', severity: 'medium', reason: '4-star review with mixed feedback', draftResponse: 'Thank you for your feedback. We are glad the shipping was fast and we will work on improving our packaging.', responseStatus: 'draft', createdAt: '2026-03-21' },
  { id: '4', authorName: 'James Wilson', rating: 1, title: 'Never ordering again', content: 'Wrong order 3 times. Complete waste of money.', source: 'Google', sentiment: 'negative', strategy: 'recovery', severity: 'critical', reason: '1-star review with repeated issue', draftResponse: 'I am deeply sorry for this terrible experience. This is unacceptable and we want to make it right immediately.', responseStatus: 'pending', createdAt: '2026-03-20' },
  { id: '5', authorName: 'Lisa Anderson', rating: 5, title: 'Perfect!', content: 'Exactly what I needed. Fast delivery too!', source: 'Yelp', sentiment: 'positive', strategy: 'appreciation', severity: 'low', reason: '5-star review with strong positive language', draftResponse: 'WOW thank you so much! We are thrilled that everything was perfect!', responseStatus: 'sent', createdAt: '2026-03-19' },
];

const severityColors: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
};

export default function ReviewsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = mockReviews.filter(r => {
    if (filter !== 'all' && r.sentiment !== filter) return false;
    if (search && !r.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Reviews</h1>
        <p className="text-muted" style={{ marginBottom: '32px' }}>AI-powered review analysis with response drafts</p>

        {/* Filters */}
        <div className="card mb-4">
          <div className="flex gap-4 flex-between">
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <div className="flex gap-2">
              {['all', 'positive', 'negative', 'neutral'].map(f => (
                <button
                  key={f}
                  className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Review List with AI Layer */}
        <div>
          {filtered.map(review => (
            <div key={review.id} className="card" style={{ marginBottom: '16px', borderLeft: `4px solid ${severityColors[review.severity]}` }}>
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
                    background: `${severityColors[review.severity]}20`,
                    color: severityColors[review.severity],
                  }}>
                    {review.severity.toUpperCase()}
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
                    <strong style={{ color: '#22c55e' }}>Strategy:</strong> {review.strategy?.toUpperCase()}
                  </span>
                  <span>
                    <strong style={{ color: severityColors[review.severity] }}>Severity:</strong> {review.severity?.toUpperCase()}
                  </span>
                  <span className="text-muted">
                    <strong>Reason:</strong> {review.reason}
                  </span>
                </div>
                
                {/* Draft Response */}
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Suggested AI Reply:
                </label>
                <textarea 
                  defaultValue={review.draftResponse}
                  style={{ width: '100%', minHeight: '100px', marginBottom: '12px', fontSize: '14px' }}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-between">
                <div className="flex gap-2">
                  {review.responseStatus === 'pending' || review.responseStatus === 'draft' ? (
                    <>
                      <button className="btn btn-primary">✓ Approve Draft</button>
                      <button className="btn btn-secondary">Edit</button>
                      <button className="btn btn-secondary">↻ Regenerate</button>
                    </>
                  ) : (
                    <span style={{ color: 'var(--success)', fontSize: '13px' }}>✓ Posted</span>
                  )}
                  <button className="btn btn-secondary">Skip</button>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {review.responseStatus === 'pending' ? '⏳ Awaiting approval' : 
                   review.responseStatus === 'draft' ? '📝 Draft ready' :
                   review.responseStatus === 'sent' ? '✓ Posted' : ''}
                </span>
              </div>
            </div>
          ))}
          
          {filtered.length === 0 && (
            <div className="card text-center">
              <p className="text-muted">No reviews found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}