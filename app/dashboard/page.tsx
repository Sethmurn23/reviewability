'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StatsCard from '../../components/StatsCard';
import ReviewCard from '../../components/ReviewCard';
import { automationRunner, type Activity } from '../../lib/automation-runner';
import { defaultSettings } from '../../lib/automation';

// Initial mock data
const initialReviews = [
  { id: '1', authorName: 'Sarah Johnson', rating: 5, content: 'The team went above and beyond to help me. Amazing service! Will definitely come back!', source: 'google', strategy: 'appreciation', severity: 'low', reason: '5-star review with strong positive language', status: 'auto_replied', draftResponse: 'Thank you so much for your wonderful review!', createdAt: '2026-03-23' },
  { id: '2', authorName: 'Mike Chen', rating: 2, content: 'Waited 45 minutes. Cold food. Very rude staff. Very frustrating terrible experience.', source: 'yelp', strategy: 'recovery', severity: 'high', reason: '2-star review with service complaint', status: 'needs_approval', draftResponse: 'We sincerely apologize for your experience.', createdAt: '2026-03-22' },
  { id: '3', authorName: 'Emily Davis', rating: 4, content: 'Great product overall. Shipping was fast but packaging could use improvement.', source: 'trustpilot', strategy: 'clarification', severity: 'medium', reason: '4-star review with mixed feedback', status: 'draft', draftResponse: 'Thank you for your feedback.', createdAt: '2026-03-21' },
  { id: '4', authorName: 'James Wilson', rating: 1, content: 'Wrong order 3 times. Complete waste of money. Never coming back.', source: 'google', strategy: 'recovery', severity: 'critical', reason: '1-star review with repeated issue', status: 'needs_approval', draftResponse: 'I am deeply sorry for this terrible experience.', createdAt: '2026-03-20' },
  { id: '5', authorName: 'Lisa Anderson', rating: 5, content: 'Exactly what I needed. Fast delivery and wonderful staff! Perfect!', source: 'google', strategy: 'appreciation', severity: 'low', reason: '5-star review with positive language', status: 'resolved', draftResponse: 'WOW thank you so much!', createdAt: '2026-03-19' },
  { id: '6', authorName: 'Tom Harris', rating: 3, content: 'It was okay. Nothing special but nothing wrong either. Average experience.', source: 'yelp', strategy: 'clarification', severity: 'medium', reason: '3-star review with neutral feedback', status: 'needs_approval', draftResponse: 'Thank you for your feedback.', createdAt: '2026-03-18' },
];

export default function DashboardPage() {
  const [reviews, setReviews] = useState(initialReviews as any[]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [isAutomationActive, setIsAutomationActive] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  // Initialize automation on mount
  useEffect(() => {
    const result = automationRunner.initialize(initialReviews as any, defaultSettings, 'Your Business');
    setReviews(result.processed);
    setActivities(automationRunner.getStatus().activities);
    setLastRun(automationRunner.getStatus().lastRun);
    setProcessedCount(automationRunner.getStatus().processedCount);
    setIsAutomationActive(true);
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      const status = automationRunner.getStatus();
      setActivities(status.activities);
      setLastRun(status.lastRun);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Weekly summary
  const summary = automationRunner.getWeeklySummary(reviews as any);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'auto_replied': return '🤖';
      case 'flagged': return '⚠️';
      case 'regenerated': return '🔄';
      case 'insight': return '💡';
      case 'approved': return '✅';
      case 'manual_response': return '💬';
      default: return '📋';
    }
  };

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

        {/* Automation Status Indicator */}
        <div className="card mb-4" style={{ 
          background: isAutomationActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          borderLeft: `4px solid ${isAutomationActive ? '#22c55e' : '#f59e0b'}`
        }}>
          <div className="flex flex-between" style={{ alignItems: 'center' }}>
            <div className="flex gap-2" style={{ alignItems: 'center' }}>
              <span style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: isAutomationActive ? '#22c55e' : '#f59e0b',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{ fontWeight: 600, color: isAutomationActive ? '#22c55e' : '#f59e0b' }}>
                {isAutomationActive ? '✅ Automation Active' : '⏸️ Automation Paused'}
              </span>
            </div>
            <div className="flex gap-4 text-muted" style={{ fontSize: '13px' }}>
              <span>Last run: {lastRun ? new Date(lastRun).toLocaleTimeString() : 'Never'}</span>
              <span>Processed: {processedCount} reviews</span>
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>📊 This Week</h2>
          <div className="grid grid-4 gap-4">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800 }}>{summary.totalProcessed}</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>Reviews Processed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#6366f1' }}>{summary.autoHandled}</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>Auto-Handled</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b' }}>{summary.needsApproval}</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>Need Approval</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: summary.ratingTrend === 'up' ? '#22c55e' : summary.ratingTrend === 'down' ? '#ef4444' : '#94a3b8' }}>
                {summary.ratingTrend === 'up' ? '📈' : summary.ratingTrend === 'down' ? '📉' : '➡️'} {summary.avgRating}
              </div>
              <div className="text-muted" style={{ fontSize: '12px' }}>Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>📜 Recent Activity</h2>
          {activities.length > 0 ? (
            <div className="grid gap-2">
              {activities.slice(0, 8).map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex gap-2"
                  style={{ 
                    padding: '10px 12px', 
                    background: 'var(--bg)', 
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{getActivityIcon(activity.type)}</span>
                  <span style={{ flex: 1, color: 'var(--text-muted)' }}>{activity.message}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted" style={{ fontSize: '13px' }}>No recent activity</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-4 mb-4">
          <StatsCard 
            title="Needs Approval" 
            value={reviews.filter(r => r.status === 'needs_approval').length} 
            change="Action required"
            trend="neutral"
            icon="⏳"
          />
          <StatsCard 
            title="Auto-Handled" 
            value={reviews.filter(r => r.status === 'auto_replied').length} 
            change="Automated"
            trend="up"
            icon="🤖"
          />
          <StatsCard 
            title="Failed" 
            value={reviews.filter(r => r.status === 'failed').length} 
            change="Check logs"
            trend="neutral"
            icon="❌"
          />
          <StatsCard 
            title="Total Reviews" 
            value={reviews.length} 
            change="All time"
            trend="neutral"
            icon="⭐"
          />
        </div>

        {/* Needs Approval Section */}
        {reviews.filter(r => r.status === 'needs_approval').length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#f59e0b' }}>⏳</span> Needs Approval ({reviews.filter(r => r.status === 'needs_approval').length})
            </h2>
            
            {reviews.filter(r => r.status === 'needs_approval').slice(0, 3).map((review: any) => (
              <div key={review.id} className="card" style={{ marginBottom: '12px', borderLeft: '4px solid #ef4444' }}>
                <div className="flex flex-between" style={{ alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: '#f59e0b', fontSize: '14px', marginRight: '8px' }}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                      {review.content}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                      background: '#ef444420',
                      color: '#ef4444',
                    }}>
                      {(review.severity || 'high').toUpperCase()}
                    </span>
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Review Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auto-Handled Preview */}
        {reviews.filter(r => r.status === 'auto_replied').length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#6366f1' }}>🤖</span> Auto-Handled Preview ({reviews.filter(r => r.status === 'auto_replied').length})
            </h2>
            <p className="text-muted" style={{ fontSize: '13px', marginBottom: '16px' }}>
              This would have been automatically posted:
            </p>
            
            {reviews.filter(r => r.status === 'auto_replied').slice(0, 2).map((review: any) => (
              <div key={review.id} className="card" style={{ marginBottom: '12px', borderLeft: '4px solid #6366f1' }}>
                <div className="flex flex-between" style={{ alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 600, marginRight: '8px' }}>{review.authorName}</span>
                    <span style={{ fontSize: '13px', color: '#f59e0b' }}>{'★'.repeat(review.rating)}</span>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: '#6366f120',
                    color: '#6366f1',
                  }}>
                    ✓ Would auto-post
                  </span>
                </div>
                <div style={{ 
                  padding: '12px', 
                  background: 'var(--bg)', 
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: 'var(--text-muted)'
                }}>
                  "{review.draftResponse}"
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-3 mt-4">
          <div className="card">
            <h3 style={{ marginBottom: '12px' }}>⚡ Quick Actions</h3>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              <button className="btn btn-secondary">Approve All Drafts</button>
              <button className="btn btn-secondary">Export Report</button>
            </div>
          </div>
          
          <div className="card">
            <h3 style={{ marginBottom: '12px' }}>📈 Rating Trend</h3>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#22c55e' }}>{summary.avgRating}</div>
            <p className="text-muted" style={{ fontSize: '13px' }}>Average rating this week</p>
          </div>
          
          <div className="card">
            <h3 style={{ marginBottom: '12px' }}>📊 Response Rate</h3>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#6366f1' }}>
              {Math.round(((summary.autoHandled + summary.resolved) / Math.max(summary.totalProcessed, 1)) * 100)}%
            </div>
            <p className="text-muted" style={{ fontSize: '13px' }}>Reviews handled</p>
          </div>
        </div>
      </main>
    </div>
  );
}