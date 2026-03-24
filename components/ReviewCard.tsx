'use client';

interface ReviewCardProps {
  review: {
    id: string;
    authorName: string;
    rating: number;
    title?: string;
    content: string;
    source: string;
    sentiment?: string;
    responseStatus?: string | null;
    createdAt: string;
  };
  onRespond?: (id: string) => void;
}

export default function ReviewCard({ review, onRespond }: ReviewCardProps) {
  const sentimentColors: Record<string, string> = {
    positive: '#22c55e',
    negative: '#ef4444',
    neutral: '#94a3b8',
  };

  const sentimentColor = sentimentColors[review.sentiment || 'neutral'];

  return (
    <div className="card" style={{ marginBottom: '16px' }}>
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
            fontSize: '16px',
          }}>
            {review.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{review.authorName}</div>
            <div className="text-muted" style={{ fontSize: '12px' }}>
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2" style={{ alignItems: 'center' }}>
          <span style={{ color: '#f59e0b', fontSize: '18px' }}>
            {'★'.repeat(review.rating)}
            {'☆'.repeat(5 - review.rating)}
          </span>
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            background: `${sentimentColor}20`,
            color: sentimentColor,
          }}>
            {review.sentiment?.toUpperCase() || 'ANALYZING'}
          </span>
        </div>
      </div>

      {review.title && (
        <div style={{ fontWeight: 600, marginBottom: '8px' }}>{review.title}</div>
      )}
      
      <p style={{ 
        color: 'var(--text-muted)', 
        lineHeight: 1.6, 
        marginBottom: '16px' 
      }}>
        {review.content}
      </p>

      <div className="flex flex-between">
        <div className="flex gap-2" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>📢 {review.source}</span>
          {review.responseStatus && (
            <span style={{
              color: review.responseStatus === 'sent' ? 'var(--success)' : 'var(--warning)',
            }}>
              {review.responseStatus === 'sent' ? '✓ Responded' : '⏳ Pending'}
            </span>
          )}
        </div>
        
        {onRespond && review.responseStatus !== 'sent' && (
          <button 
            className="btn btn-primary"
            onClick={() => onRespond(review.id)}
          >
            Respond
          </button>
        )}
      </div>
    </div>
  );
}