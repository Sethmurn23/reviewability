'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';

// Restructured insights with business-useful recommendations
const mockInsights = {
  topIssue: {
    title: 'Slow service is hurting your rating',
    description: 'Multiple reviews mention wait times as a key frustration. Consider adding staff during peak hours.',
    severity: 'high',
    metric: '23% of negative reviews mention wait times',
  },
  topStrength: {
    title: 'Customers consistently praise your friendliness',
    description: 'Your team\'s warm, welcoming approach is your biggest differentiator. Keep it up!',
    severity: 'positive',
    metric: '4.8/5 friendliness rating',
  },
  operationalFix: {
    title: 'Add a dedicated order verification step',
    description: 'Wrong orders are the #2 complaint. Implement a double-check system before delivery.',
    impact: '+0.3 rating potential',
  },
  responseRuleChange: {
    title: 'Require approval for 3-star reviews',
    description: '3-star reviews have mixed sentiment - automated responses may miss the mark. Add human review.',
    impact: 'More accurate responses',
  },
};

const typeColors: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  positive: '#22c55e',
  low: '#94a3b8',
};

export default function InsightsPage() {
  const [insights] = useState(mockInsights);

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 20px' }}>
        <div className="flex flex-between" style={{ marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Insights</h1>
            <p className="text-muted">AI-powered analysis and actionable recommendations</p>
          </div>
          <button className="btn btn-secondary">Export All</button>
        </div>

        {/* Top Issue */}
        <div className="card" style={{ marginBottom: '20px', borderLeft: '4px solid #ef4444' }}>
          <div className="flex gap-2" style={{ alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>🔴</span>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Top Issue Hurting Your Rating</h2>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#ef4444' }}>{insights.topIssue.title}</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>{insights.topIssue.description}</p>
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            padding: '8px 12px', 
            borderRadius: '6px',
            fontSize: '13px',
            color: '#ef4444',
            fontWeight: 600
          }}>
            📊 {insights.topIssue.metric}
          </div>
        </div>

        {/* Top Strength */}
        <div className="card" style={{ marginBottom: '20px', borderLeft: '4px solid #22c55e' }}>
          <div className="flex gap-2" style={{ alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>🟢</span>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Top Strength Customers Mention</h2>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#22c55e' }}>{insights.topStrength.title}</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>{insights.topStrength.description}</p>
          <div style={{ 
            background: 'rgba(34, 197, 94, 0.1)', 
            padding: '8px 12px', 
            borderRadius: '6px',
            fontSize: '13px',
            color: '#22c55e',
            fontWeight: 600
          }}>
            📊 {insights.topStrength.metric}
          </div>
        </div>

        {/* Operational Fix */}
        <div className="card" style={{ marginBottom: '20px', borderLeft: '4px solid #6366f1' }}>
          <div className="flex gap-2" style={{ alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>🔧</span>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Recommended Operational Fix</h2>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#6366f1' }}>{insights.operationalFix.title}</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>{insights.operationalFix.description}</p>
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.1)', 
            padding: '8px 12px', 
            borderRadius: '6px',
            fontSize: '13px',
            color: '#6366f1',
            fontWeight: 600
          }}>
            🎯 {insights.operationalFix.impact}
          </div>
        </div>

        {/* Response Rule Change */}
        <div className="card" style={{ marginBottom: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div className="flex gap-2" style={{ alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>⚡</span>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Recommended Response Rule Change</h2>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#f59e0b' }}>{insights.responseRuleChange.title}</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>{insights.responseRuleChange.description}</p>
          <div style={{ 
            background: 'rgba(245, 158, 11, 0.1)', 
            padding: '8px 12px', 
            borderRadius: '6px',
            fontSize: '13px',
            color: '#f59e0b',
            fontWeight: 600
          }}>
            🎯 {insights.responseRuleChange.impact}
          </div>
        </div>

        {/* Historical Summary */}
        <div className="card" style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>📊 This Week's Summary</h2>
          <div className="grid grid-3 gap-4">
            <div className="text-center">
              <div style={{ fontSize: '28px', fontWeight: 800 }}>47</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>New Reviews</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#22c55e' }}>4.2</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>Avg Rating</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#6366f1' }}>89%</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>Response Rate</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}