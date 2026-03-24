'use client';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatsCard({ title, value, change, icon, trend }: StatsCardProps) {
  const trendColors = {
    up: '#22c55e',
    down: '#ef4444',
    neutral: '#94a3b8',
  };

  return (
    <div className="card">
      <div className="flex flex-between" style={{ marginBottom: '12px' }}>
        <span className="text-muted" style={{ fontSize: '14px' }}>{title}</span>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
        {value}
      </div>
      {change && (
        <div style={{
          fontSize: '13px',
          color: trend ? trendColors[trend] : 'var(--text-muted)',
        }}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {change}
        </div>
      )}
    </div>
  );
}