'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import StatsCard from '../../components/StatsCard';
import ReviewCard from '../../components/ReviewCard';

// Mock data
const mockStats = {
  totalReviews: 1247,
  avgRating: 4.3,
  responseRate: 89,
  newThisWeek: 23,
  needsApproval: 5,
  autoRepliedToday: 12,
  failedAutomations: 1,
};

// Reviews needing approval
const pendingReviews = [
  { id: 'p1', authorName: 'Mike Chen', rating: 2, title: 'Disappointed', content: 'Waited 45 minutes. Cold food. Very frustrating.', source: 'Yelp', sentiment: 'negative', responseStatus: 'pending', severity: 'high', strategy: 'recovery', reason: '1-star review with service complaint', createdAt: '2026-03-23', draftResponse: 'We sincerely apologize for your experience. This falls well below our standards and we are taking immediate action.' },
  { id: 'p2', authorName: 'James Wilson', rating: 1, title: 'Never ordering again', content: 'Wrong order 3 times. Complete waste of money.', source: 'Google', sentiment: 'negative', responseStatus: 'pending', severity: 'high', strategy: 'recovery', reason: '1-star review with repeated issue', createdAt: '2026-03-22', draftResponse: 'I personally apologize for this terrible experience. This is not how we do business and we want to make it right.' },
];

const recentReviews = [
  { id: '1', authorName: 'Sarah Johnson', rating: 5, title: 'Amazing service!', content: 'The team went above and beyond to help me. Will definitely come back!', source: 'Google', sentiment: 'positive', responseStatus: 'sent', createdAt: '2026-03-23' },
  { id: '2', authorName: 'Emily Davis', rating: 4, content: 'Great product overall. Shipping was fast but packaging could use improvement.', source: 'Trustpilot', sentiment: 'neutral', responseStatus: undefined, createdAt: '2026-03-21' },
  { id: '3', authorName: 'Lisa Anderson', rating: 5, title: 'Perfect!', content: 'Exactly what I needed. Fast delivery too!', source: 'Yelp', sentiment: 'positive', responseStatus: 'sent', createdAt: '2026-03-19' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(mockStats);
  const [reviews] = useState(pendingReviews);

  return (
    <div>
      <Navbar />
      
      <main className="container" style={{ padding: '40px 20px' }}>
        <div className="flex flex-between" style={{ marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Dashboard</h1>
            <p className="text-muted">Command center for your review management</p>
          </div>
          <button className="btn btn-primary">+ Add Business</button>
        </div>

        {/* Command Center Stats */}
        <div className="grid grid-4 mb-4">
          <StatsCard 
            title="Needs Approval" 
            value={stats.needsApproval} 
            change="Action required"
            trend="neutral"
            icon="⚠️"
          />
          <StatsCard 
            title="Auto-Replied Today" 
            value={stats.autoRepliedToday} 
            change="Automated responses"
            trend="up"
            icon="🤖"
          />
          <StatsCard 
            title="Failed Automations" 
            value={stats.failedAutomations} 
            change="Check logs"
            trend="neutral"
            icon="❌"
          />
          <StatsCard 
            title="New Reviews" 
            value={stats.newThisWeek} 
            change="This week"
            trend="up"
            icon="⭐"
          />
        </div>

        {/* Needs Approval Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#f59e0b' }}>⚠️</span> Needs Approval
          </h2>
          
          {reviews.map((review) => (
            <div key={review.id} className="card" style={{ marginBottom: '16px', borderLeft: '4px solid #ef4444' }}>
              <div className="flex flex-between" style={{ marginBottom: '12px' }}>
                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                  <span style={{ color: '#f59e0b', fontSize: '18px' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: review.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: review.severity === 'high' ? '#ef4444' : '#f59e0b',
                  }}>
                    {review.severity.toUpperCase()} SEVERITY
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{review.source}</span>
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{review.authorName}</span>
              </div>
              
              <p style={{ marginBottom: '12px', lineHeight: 1.6 }}>{review.content}</p>
              
              <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <strong style={{ color: '#22c55e' }}>{review.strategy?.toUpperCase()}</strong> • {review.reason}
                </div>
                <textarea 
                  defaultValue={review.draftResponse}
                  style={{ width: '100%', minHeight: '80px', marginTop: '8px', fontSize: '13px' }}
                />
              </div>
              
              <div className="flex gap-2">
                <button className="btn btn-primary" style={{ padding: '8px 16px' }}>✓ Approve Draft</button>
                <button className="btn btn-secondary" style={{ padding: '8px 16px' }}>Edit</button>
                <button className="btn btn-secondary" style={{ padding: '8px 16px' }}>↻ Regenerate</button>
                <button className="btn btn-secondary" style={{ padding: '8px 16px' }}>Skip</button>
              </div>
            </div>
          ))}
          
          {reviews.length === 0 && (
            <div className="card text-center">
              <p className="text-success">✓ All caught up! No reviews need approval.</p>
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div>
          <div className="flex flex-between" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Recent Reviews</h2>
            <a href="/reviews" className="text-muted" style={{ textDecoration: 'none' }}>
              View all →
            </a>
          </div>
          
          {recentReviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review}
              onRespond={(id) => console.log('Respond to', id)}
            />
          ))}
        </div>

        {/* Avg Rating (keep existing) */}
        <div className="grid grid-3 mt-4">
          <div className="card">
            <h3 style={{ marginBottom: '12px' }}>📈 Rating Trend</h3>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#22c55e' }}>{stats.avgRating}</div>
            <p className="text-muted" style={{ fontSize: '13px' }}>Average rating this month</p>
          </div>
          
          <div className="card">
            <h3 style={{ marginBottom: '12px' }}>📊 Response Rate</h3>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#6366f1' }}>{stats.responseRate}%</div>
            <p className="text-muted" style={{ fontSize: '13px' }}>Reviews responded to</p>
          </div>
          
          <div className="card">
            <h3 style={{ marginBottom: '12px' }}>🎯 Quick Actions</h3>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              <button className="btn btn-secondary">Approve All Drafts</button>
              <button className="btn btn-secondary">Export Report</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}