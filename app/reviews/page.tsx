'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import ReviewCard from '../../components/ReviewCard';
import ToggleSwitch from '../../components/ToggleSwitch';

const mockReviews = [
  { id: '1', authorName: 'Sarah Johnson', rating: 5, title: 'Amazing service!', content: 'The team went above and beyond to help me.', source: 'Google', sentiment: 'positive', responseStatus: 'sent', createdAt: '2026-03-23' },
  { id: '2', authorName: 'Mike Chen', rating: 2, title: 'Disappointed', content: 'Waited 45 minutes. Cold food. Very frustrating.', source: 'Yelp', sentiment: 'negative', responseStatus: 'pending', createdAt: '2026-03-22' },
  { id: '3', authorName: 'Emily Davis', rating: 4, content: 'Great product overall. Shipping was fast.', source: 'Trustpilot', sentiment: 'neutral', responseStatus: undefined, createdAt: '2026-03-21' },
  { id: '4', authorName: 'James Wilson', rating: 1, title: 'Never ordering again', content: 'Wrong order 3 times. Complete waste of money.', source: 'Google', sentiment: 'negative', responseStatus: undefined, createdAt: '2026-03-20' },
  { id: '5', authorName: 'Lisa Anderson', rating: 5, title: 'Perfect!', content: 'Exactly what I needed. Fast delivery too!', source: 'Yelp', sentiment: 'positive', responseStatus: 'sent', createdAt: '2026-03-19' },
];

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
        <p className="text-muted" style={{ marginBottom: '32px' }}>Manage and respond to all your customer reviews</p>

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

        {/* Review List */}
        <div>
          {filtered.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              onRespond={(id) => console.log('Respond to', id)}
            />
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