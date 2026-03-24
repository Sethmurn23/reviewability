'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StatsCard from '../../components/StatsCard';
import ReviewCard from '../../components/ReviewCard';

// Mock data
const mockStats = {
  totalReviews: 1247,
  avgRating: 4.3,
  responseRate: 89,
  newThisWeek: 23,
};

const mockReviews = [
  {
    id: '1',
    authorName: 'Sarah Johnson',
    rating: 5,
    title: 'Amazing service!',
    content: 'The team went above and beyond to help me. Will definitely come back!',
    source: 'Google',
    sentiment: 'positive',
    responseStatus: 'sent',
    createdAt: '2026-03-23',
  },
  {
    id: '2',
    authorName: 'Mike Chen',
    rating: 2,
    title: 'Disappointed',
    content: 'Waited 45 minutes for my order. Cold food when it finally arrived. Very frustrating experience.',
    source: 'Yelp',
    sentiment: 'negative',
    responseStatus: 'pending',
    createdAt: '2026-03-22',
  },
  {
    id: '3',
    authorName: 'Emily Davis',
    rating: 4,
    title: 'Good but could be better',
    content: 'Great product overall. Shipping was fast but packaging could use improvement.',
    source: 'Trustpilot',
    sentiment: 'neutral',
    responseStatus: undefined,
    createdAt: '2026-03-21',
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(mockStats);
  const [reviews, setReviews] = useState(mockReviews);

  return (
    <div>
      <Navbar />
      
      <main className="container" style={{ padding: '40px 20px' }}>
        <div className="flex flex-between" style={{ marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Dashboard</h1>
            <p className="text-muted">Welcome back! Here's your review overview.</p>
          </div>
          <button className="btn btn-primary">+ Add Business</button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-4 mb-4">
          <StatsCard 
            title="Total Reviews" 
            value={stats.totalReviews.toLocaleString()} 
            change="+12% this month"
            trend="up"
            icon="⭐"
          />
          <StatsCard 
            title="Avg Rating" 
            value={stats.avgRating} 
            change="+0.2 this month"
            trend="up"
            icon="📊"
          />
          <StatsCard 
            title="Response Rate" 
            value={`${stats.responseRate}%`} 
            change="+5% this month"
            trend="up"
            icon="💬"
          />
          <StatsCard 
            title="New This Week" 
            value={stats.newThisWeek} 
            change="+8 vs last week"
            trend="up"
            icon="🔔"
          />
        </div>

        {/* Recent Reviews */}
        <div>
          <div className="flex flex-between" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Recent Reviews</h2>
            <a href="/reviews" className="text-muted" style={{ textDecoration: 'none' }}>
              View all →
            </a>
          </div>
          
          {reviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review}
              onRespond={(id) => console.log('Respond to', id)}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-3 mt-4">
          <div className="card">
            <h3 style={{ marginBottom: '12px' }}>⚡ Quick Actions</h3>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              <button className="btn btn-secondary">Generate All Responses</button>
              <button className="btn btn-secondary">Export Report</button>
            </div>
          </div>
          
          <div className="card">
            <h3 style={{ marginBottom: '12px' }}>📈 Trend Alert</h3>
            <p className="text-muted" style={{ fontSize: '14px' }}>
              Your rating increased 0.2 points this month. Keep up the great work!
            </p>
          </div>
          
          <div className="card">
            <h3 style={{ marginBottom: '12px' }}>🎯 Priority Actions</h3>
            <p className="text-muted" style={{ fontSize: '14px' }}>
              3 urgent reviews require immediate attention.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}