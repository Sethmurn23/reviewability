'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import StatsCard from '../../components/StatsCard';
import ReviewCard from '../../components/ReviewCard';
import { simulateAutomation, defaultSettings } from '../../lib/automation';

// Mock data with status field
const mockReviews = [
  { id: '1', authorName: 'Sarah Johnson', rating: 5, title: 'Amazing service!', content: 'The team went above and beyond to help me. Will definitely come back!', source: 'google', sentiment: 'positive', strategy: 'appreciation', severity: 'low', reason: '5-star review with strong positive language', status: 'auto_replied', draftResponse: 'Thank you so much for your wonderful review!', createdAt: '2026-03-23' },
  { id: '2', authorName: 'Mike Chen', rating: 2, title: 'Disappointed', content: 'Waited 45 minutes. Cold food. Very frustrating.', source: 'yelp', sentiment: 'negative', strategy: 'recovery', severity: 'high', reason: '1-star review with service complaint', status: 'needs_approval', draftResponse: 'We sincerely apologize for your experience.', createdAt: '2026-03-22' },
  { id: '3', authorName: 'Emily Davis', rating: 4, content: 'Great product overall. Shipping was fast but packaging could use improvement.', source: 'trustpilot', sentiment: 'neutral', strategy: 'clarification', severity: 'medium', reason: '4-star review with mixed feedback', status: 'draft', draftResponse: 'Thank you for your feedback.', createdAt: '2026-03-21' },
  { id: '4', authorName: 'James Wilson', rating: 1, title: 'Never ordering again', content: 'Wrong order 3 times. Complete waste of money.', source: 'google', sentiment: 'negative', strategy: 'recovery', severity: 'critical', reason: '1-star review with repeated issue', status: 'needs_approval', draftResponse: 'I am deeply sorry for this terrible experience.', createdAt: '2026-03-20' },
  { id: '5', authorName: 'Lisa Anderson', rating: 5, title: 'Perfect!', content: 'Exactly what I needed. Fast delivery too!', source: 'google', sentiment: 'positive', strategy: 'appreciation', severity: 'low', reason: '5-star review with strong positive language', status: 'resolved', draftResponse: 'WOW thank you so much!', createdAt: '2026-03-19' },
];

export default function DashboardPage() {
  const [reviews, setReviews] = useState<any[]>(mockReviews);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Calculate stats
  const stats = {
    totalReviews: reviews.length,
    avgRating: 4.3,
    responseRate: 89,
    newThisWeek: 23,
    needsApproval: reviews.filter(r => r.status === 'needs_approval').length,
    autoReplied: reviews.filter(r => r.status === 'auto_replied').length,
    autoHandledThisWeek: 12,
    failedAutomations: reviews.filter(r => r.status === 'failed').length,
  };

  // Run simulation
  const runSimulation = () => {
    setSimulating(true);
    
    setTimeout(() => {
      const result = simulateAutomation(reviews as any, defaultSettings, 'Test Business');
      setReviews(result.processed as any);
      setSimulationResult(result.stats);
      setSimulating(false);
    }, 1500);
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
          <div className="flex gap-2">
            <button 
              className="btn btn-secondary" 
              onClick={runSimulation}
              disabled={simulating}
            >
              {simulating ? '⚙️ Running...' : '▶️ Simulate Automation'}
            </button>
            <button className="btn btn-primary">+ Add Business</button>
          </div>
        </div>

        {/* Simulation Result */}
        {simulationResult && (
          <div className="card mb-4" style={{ borderLeft: '4px solid #22c55e' }}>
            <div className="flex flex-between" style={{ alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>🎯 Simulation Complete</h3>
                <p className="text-muted" style={{ fontSize: '13px' }}>
                  Auto-handled: {simulationResult.stats.autoHandled} | Needs approval: {simulationResult.stats.needsApproval}
                </p>
              </div>
              <button 
                className="btn btn-secondary" 
                onClick={() => setSimulationResult(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Command Center Stats */}
        <div className="grid grid-4 mb-4">
          <StatsCard 
            title="Needs Approval" 
            value={stats.needsApproval} 
            change="Action required"
            trend="neutral"
            icon="⏳"
          />
          <StatsCard 
            title="Auto-Handled" 
            value={stats.autoHandledThisWeek} 
            change="This week"
            trend="up"
            icon="🤖"
          />
          <StatsCard 
            title="Failed" 
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
        {stats.needsApproval > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#f59e0b' }}>⏳</span> Needs Approval ({stats.needsApproval})
            </h2>
            
            {reviews.filter(r => r.status === 'needs_approval').map((review) => (
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

        {/* Auto-Handled Section */}
        {stats.autoReplied > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#6366f1' }}>🤖</span> Auto-Handled ({stats.autoReplied})
            </h2>
            
            {reviews.filter(r => r.status === 'auto_replied').map((review) => (
              <div key={review.id} className="card" style={{ marginBottom: '12px', borderLeft: '4px solid #6366f1' }}>
                <div className="flex flex-between" style={{ alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 600, marginRight: '8px' }}>{review.authorName}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {review.content.substring(0, 60)}...
                    </span>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: '#6366f120',
                    color: '#6366f1',
                  }}>
                    ✓ Auto-replied
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All Reviews */}
        <div>
          <div className="flex flex-between" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>All Reviews ({reviews.length})</h2>
            <a href="/reviews" className="text-muted" style={{ textDecoration: 'none' }}>
              View all →
            </a>
          </div>
          
          {reviews.slice(0, 3).map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review}
              onRespond={(id) => console.log('Respond to', id)}
            />
          ))}
        </div>

        {/* Rating & Quick Actions */}
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
            <h3 style={{ marginBottom: '12px' }}>⚡ Quick Actions</h3>
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