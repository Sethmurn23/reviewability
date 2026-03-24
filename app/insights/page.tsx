'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { generateBasicInsights, analyzeKeywordFrequency, calculateSentimentDistribution } from '../../lib/insights-engine';

// Mock reviews for insights
const mockReviews = [
  { id: '1', authorName: 'Sarah Johnson', rating: 5, content: 'The team went above and beyond to help me. Amazing service! Will definitely come back!', source: 'google', strategy: 'appreciation', severity: 'low', status: 'auto_replied', createdAt: '2026-03-23' },
  { id: '2', authorName: 'Mike Chen', rating: 2, content: 'Waited 45 minutes. Cold food. Very rude staff. Very frustrating terrible experience.', source: 'yelp', strategy: 'recovery', severity: 'high', status: 'needs_approval', createdAt: '2026-03-22' },
  { id: '3', authorName: 'Emily Davis', rating: 4, content: 'Great product overall. Shipping was fast but packaging could use improvement.', source: 'trustpilot', strategy: 'clarification', severity: 'medium', status: 'draft', createdAt: '2026-03-21' },
  { id: '4', authorName: 'James Wilson', rating: 1, content: 'Wrong order 3 times. Complete waste of money. Never coming back.', source: 'google', strategy: 'recovery', severity: 'critical', status: 'needs_approval', createdAt: '2026-03-20' },
  { id: '5', authorName: 'Lisa Anderson', rating: 5, content: 'Exactly what I needed. Fast delivery and wonderful staff! Perfect!', source: 'google', strategy: 'appreciation', severity: 'low', status: 'resolved', createdAt: '2026-03-19' },
  { id: '6', authorName: 'Tom Harris', rating: 3, content: 'It was okay. Nothing special but nothing wrong either. Average experience.', source: 'yelp', strategy: 'clarification', severity: 'medium', status: 'needs_approval', createdAt: '2026-03-18' },
  { id: '7', authorName: 'Anna Martinez', rating: 2, content: 'Staff was rude. Waited forever for nothing. Disappointing service.', source: 'google', strategy: 'recovery', severity: 'high', status: 'draft', createdAt: '2026-03-17' },
];

export default function InsightsPage() {
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // Run analysis
  const insights = generateBasicInsights(mockReviews);
  const keywords = analyzeKeywordFrequency(mockReviews);
  const distribution = calculateSentimentDistribution(mockReviews);

  const handleAction = (action: string) => {
    setSelectedAction(action);
    setShowActionModal(true);
  };

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 20px' }}>
        <div className="flex flex-between" style={{ marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Insights</h1>
            <p className="text-muted">AI-powered analysis from {mockReviews.length} reviews</p>
          </div>
          <button className="btn btn-secondary">Export All</button>
        </div>

        {/* Action Buttons */}
        <div className="card mb-4" style={{ borderLeft: '4px solid #6366f1' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>⚡ Quick Actions</h2>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => handleAction('automation')}>
              ⚙️ Adjust Automation
            </button>
            <button className="btn btn-secondary" onClick={() => handleAction('threshold')}>
              📊 Increase Approval Threshold
            </button>
            <button className="btn btn-secondary" onClick={() => handleAction('focus')}>
              🎯 Focus on Issue
            </button>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>📊 Sentiment Distribution</h2>
          <div className="grid grid-3 gap-4">
            <div className="card" style={{ textAlign: 'center', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#22c55e' }}>{distribution.positive}</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>Positive (4-5 stars)</div>
              <div style={{ fontSize: '12px', color: '#22c55e' }}>{Math.round((distribution.positive / mockReviews.length) * 100)}%</div>
            </div>
            <div className="card" style={{ textAlign: 'center', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b' }}>{distribution.neutral}</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>Neutral (3 stars)</div>
              <div style={{ fontSize: '12px', color: '#f59e0b' }}>{Math.round((distribution.neutral / mockReviews.length) * 100)}%</div>
            </div>
            <div className="card" style={{ textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#ef4444' }}>{distribution.negative}</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>Negative (1-2 stars)</div>
              <div style={{ fontSize: '12px', color: '#ef4444' }}>{Math.round((distribution.negative / mockReviews.length) * 100)}%</div>
            </div>
          </div>
        </div>

        {/* Keyword Analysis */}
        <div className="grid grid-2 gap-4 mb-4">
          {/* Top Positive Keywords */}
          <div className="card">
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🟢</span> What Customers Love
            </h2>
            {keywords.positive.length > 0 ? (
              <div>
                {keywords.positive.map((item, i) => (
                  <div key={i} style={{ marginBottom: '12px' }}>
                    <div className="flex flex-between" style={{ marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>{item.keyword}</span>
                      <span style={{ fontSize: '12px', color: '#22c55e' }}>{item.percentage}%</span>
                    </div>
                    <div style={{ background: '#1e293b', borderRadius: '4px', height: '8px' }}>
                      <div style={{ 
                        background: '#22c55e', 
                        borderRadius: '4px', 
                        height: '8px', 
                        width: `${item.percentage}%` 
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted" style={{ fontSize: '13px' }}>No positive keywords detected</p>
            )}
          </div>

          {/* Top Negative Keywords */}
          <div className="card">
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔴</span> Top Complaints
            </h2>
            {keywords.negative.length > 0 ? (
              <div>
                {keywords.negative.map((item, i) => (
                  <div key={i} style={{ marginBottom: '12px' }}>
                    <div className="flex flex-between" style={{ marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>{item.keyword}</span>
                      <span style={{ fontSize: '12px', color: '#ef4444' }}>{item.percentage}%</span>
                    </div>
                    <div style={{ background: '#1e293b', borderRadius: '4px', height: '8px' }}>
                      <div style={{ 
                        background: '#ef4444', 
                        borderRadius: '4px', 
                        height: '8px', 
                        width: `${item.percentage}%` 
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted" style={{ fontSize: '13px' }}>No negative keywords detected</p>
            )}
          </div>
        </div>

        {/* Top Issue */}
        {insights.topComplaint && (
          <div className="card" style={{ marginBottom: '20px', borderLeft: '4px solid #ef4444' }}>
            <div className="flex gap-2" style={{ alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>🔴</span>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Top Issue Hurting Your Rating</h2>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#ef4444' }}>{insights.topComplaint}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{insights.recommendation}</p>
            <button 
              className="btn btn-secondary" 
              style={{ marginTop: '12px' }}
              onClick={() => handleAction('focus')}
            >
              🎯 Focus on Issue
            </button>
          </div>
        )}

        {/* Top Strength */}
        {insights.topPositive && (
          <div className="card" style={{ marginBottom: '20px', borderLeft: '4px solid #22c55e' }}>
            <div className="flex gap-2" style={{ alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>🟢</span>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Top Strength Customers Mention</h2>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#22c55e' }}>{insights.topPositive}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Keep up the great work! Your customers consistently praise this.</p>
          </div>
        )}

        {/* Rating Trend */}
        <div className="card" style={{ marginBottom: '20px', borderLeft: '4px solid #6366f1' }}>
          <div className="flex gap-2" style={{ alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>📈</span>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Rating Trend</h2>
          </div>
          <div className="flex flex-between" style={{ alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Overall Assessment</div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: insights.ratingTrend === 'up' ? '#22c55e' : insights.ratingTrend === 'down' ? '#ef4444' : '#f59e0b'
              }}>
                {insights.ratingTrend === 'up' ? '📈 Improving' : insights.ratingTrend === 'down' ? '📉 Declining' : '➡️ Stable'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '28px', fontWeight: 800 }}>4.0</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>Average Rating</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>📊 Analysis Summary</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6 }}>
            {insights.summary}
          </p>
        </div>

        {/* Action Modal */}
        {showActionModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                {selectedAction === 'automation' && '⚙️ Adjust Automation'}
                {selectedAction === 'threshold' && '📊 Increase Approval Threshold'}
                {selectedAction === 'focus' && '🎯 Focus on Issue'}
              </h2>
              <p className="text-muted" style={{ fontSize: '14px', marginBottom: '20px' }}>
                This would adjust your automation settings to better handle this insight.
                In a live system, this would update your automation rules automatically.
              </p>
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={() => setShowActionModal(false)}>
                  Confirm
                </button>
                <button className="btn btn-secondary" onClick={() => setShowActionModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}