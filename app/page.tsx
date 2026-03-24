'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      
      {/* Hero */}
      <section style={{
        textAlign: 'center',
        padding: '80px 20px',
        background: 'linear-gradient(180deg, var(--bg) 0%, var(--card) 100%)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 800,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Never miss a customer review
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--text-muted)',
            marginBottom: '40px',
            lineHeight: 1.6,
          }}>
            Aggregate reviews from Google, Yelp, Trustpilot & more.<br/>
            AI analyzes sentiment, detects urgency, and auto-generates responses.
          </p>
          <div className="flex gap-4" style={{ justifyContent: 'center' }}>
            <Link href="/dashboard" className="btn btn-primary" style={{
              padding: '14px 32px',
              fontSize: '16px',
              borderRadius: '12px',
            }}>
              Get Started Free
            </Link>
            <button className="btn btn-secondary" style={{
              padding: '14px 32px',
              fontSize: '16px',
              borderRadius: '12px',
            }}>
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 20px' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>
            Everything you need
          </h2>
          <div className="grid grid-3">
            {[
              { icon: '📊', title: 'Unified Dashboard', desc: 'See all reviews from every platform in one place' },
              { icon: '🤖', title: 'AI Analysis', desc: 'Sentiment, urgency, and topic detection automatically' },
              { icon: '⚡', title: 'Auto Responses', desc: 'Generate professional responses in seconds' },
              { icon: '💡', title: 'Smart Insights', desc: 'AI-powered trends and recommendations' },
              { icon: '🔔', title: 'Real-time Alerts', desc: 'Get notified about urgent reviews immediately' },
              { icon: '📈', title: 'Analytics', desc: 'Track ratings, sentiment, and trends over time' },
            ].map((feature, i) => (
              <div key={i} className="card">
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{feature.title}</h3>
                <p className="text-muted" style={{ fontSize: '14px' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '60px 20px', background: 'var(--card)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>
            Simple pricing
          </h2>
          <div className="grid grid-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Free</h3>
              <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: '20px' }}>$0</div>
              <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '20px', fontSize: '14px' }} className="text-muted">
                <li>✓ 1 business</li>
                <li>✓ 50 reviews/month</li>
                <li>✓ Basic analytics</li>
              </ul>
              <Link href="/dashboard" className="btn btn-secondary" style={{ width: '100%' }}>Start Free</Link>
            </div>
            <div className="card" style={{ textAlign: 'center', borderColor: 'var(--primary)' }}>
              <div style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>POPULAR</div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Pro</h3>
              <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: '20px' }}>$29<span style={{ fontSize: '16px' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '20px', fontSize: '14px' }} className="text-muted">
                <li>✓ Unlimited businesses</li>
                <li>✓ Unlimited reviews</li>
                <li>✓ AI responses</li>
                <li>✓ Auto-automation</li>
                <li>✓ Priority support</li>
              </ul>
              <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%' }}>Start Trial</Link>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Enterprise</h3>
              <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: '20px' }}>$99<span style={{ fontSize: '16px' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '20px', fontSize: '14px' }} className="text-muted">
                <li>✓ Everything in Pro</li>
                <li>✓ Custom integrations</li>
                <li>✓ Dedicated support</li>
                <li>✓ SLA guarantee</li>
                <li>✓ Custom AI models</li>
              </ul>
              <Link href="/dashboard" className="btn btn-secondary" style={{ width: '100%' }}>Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
        © 2026 Reviewability. All rights reserved.
      </footer>
    </div>
  );
}