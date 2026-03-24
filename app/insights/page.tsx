'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';

const mockInsights = [
  { id: '1', type: 'trend', title: 'Rating trend improving', content: 'Your average rating has increased 0.3 points over the past month. Keep up the great work!', createdAt: '2026-03-23', isRead: false },
  { id: '2', type: 'anomaly', title: 'Spike in negative reviews', content: 'We noticed a 40% increase in negative reviews this week. Common themes: wait times and order accuracy.', createdAt: '2026-03-22', isRead: false },
  { id: '3', type: 'recommendation', title: 'Address shipping concerns', content: 'Multiple reviews mention packaging issues. Consider upgrading your packaging supplier.', createdAt: '2026-03-21', isRead: true },
  { id: '4', type: 'summary', title: 'Weekly summary', content: 'This week: 47 new reviews, 4.2 avg rating, 89% response rate. Top topic: customer service.', createdAt: '2026-03-20', isRead: true },
];

const typeIcons: Record<string, string> = {
  trend: '📈',
  anomaly: '⚠️',
  recommendation: '💡',
  summary: '📊',
};

const typeColors: Record<string, string> = {
  trend: '#22c55e',
  anomaly: '#ef4444',
  recommendation: '#6366f1',
  summary: '#f59e0b',
};

export default function InsightsPage() {
  const [insights] = useState(mockInsights);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? insights : insights.filter(i => i.type === filter);

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 20px' }}>
        <div className="flex flex-between" style={{ marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Insights</h1>
            <p className="text-muted">AI-powered analysis and recommendations</p>
          </div>
          <button className="btn btn-secondary">Export All</button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {['all', 'trend', 'anomaly', 'recommendation', 'summary'].map(f => (
            <button
              key={f}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Insights List */}
        <div className="grid gap-4">
          {filtered.map(insight => (
            <div key={insight.id} className="card" style={{
              borderLeft: `4px solid ${typeColors[insight.type]}`,
              opacity: insight.isRead ? 0.7 : 1,
            }}>
              <div className="flex flex-between" style={{ marginBottom: '12px' }}>
                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                  <span style={{ fontSize: '24px' }}>{typeIcons[insight.type]}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{insight.title}</h3>
                </div>
                <span className="text-muted" style={{ fontSize: '12px' }}>
                  {new Date(insight.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                {insight.content}
              </p>
              {!insight.isRead && (
                <button className="btn btn-secondary" style={{ marginTop: '12px', padding: '6px 12px', fontSize: '12px' }}>
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card text-center">
            <p className="text-muted">No insights found</p>
          </div>
        )}
      </main>
    </div>
  );
}