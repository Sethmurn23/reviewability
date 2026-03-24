'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import ToggleSwitch from '../../components/ToggleSwitch';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoResponse: false,
    aiAnalysis: true,
    emailAlerts: true,
    slackWebhook: '',
    businessName: 'My Business',
    industry: 'retail',
    responseTone: 'professional',
  });

  const update = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  // Integration status - Google is now "Coming soon" with more detail
  const integrations = [
    { 
      name: 'Google Business Profile', 
      status: 'coming_soon', 
      description: 'Import and manage Google reviews inside Reviewability',
      icon: '🔍',
      buttonLabel: 'Connect Google',
    },
    { name: 'Yelp', status: 'coming_soon', description: 'Import reviews from Yelp', icon: '📋', buttonLabel: 'Coming soon' },
    { name: 'Trustpilot', status: 'coming_soon', description: 'Sync reviews from Trustpilot', icon: '⭐', buttonLabel: 'Coming soon' },
    { name: 'Facebook', status: 'coming_soon', description: 'Import Facebook reviews', icon: '📘', buttonLabel: 'Coming soon' },
  ];

  const statusLabels: Record<string, { label: string; color: string }> = {
    connected: { label: 'Connected', color: '#22c55e' },
    not_connected: { label: 'Not connected', color: '#94a3b8' },
    coming_soon: { label: 'Coming soon', color: '#f59e0b' },
  };

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Settings</h1>
        <p className="text-muted" style={{ marginBottom: '32px' }}>Manage your account and preferences</p>

        {/* Profile */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Business Profile</h2>
          <div className="grid grid-2 gap-4">
            <div>
              <label className="text-muted" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => update('businessName', e.target.value)}
              />
            </div>
            <div>
              <label className="text-muted" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Industry</label>
              <select
                value={settings.industry}
                onChange={(e) => update('industry', e.target.value)}
              >
                <option value="retail">Retail</option>
                <option value="restaurant">Restaurant</option>
                <option value="hotel">Hotel</option>
                <option value="healthcare">Healthcare</option>
                <option value="service">Service</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Settings */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>AI Settings</h2>
          <div className="grid gap-4">
            <div className="flex flex-between">
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Auto-Response</div>
                <div className="text-muted" style={{ fontSize: '13px' }}>Automatically generate responses to reviews</div>
              </div>
              <ToggleSwitch
                enabled={settings.autoResponse}
                onChange={(v) => update('autoResponse', v)}
              />
            </div>
            <div className="flex flex-between">
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>AI Analysis</div>
                <div className="text-muted" style={{ fontSize: '13px' }}>Analyze sentiment and detect topics</div>
              </div>
              <ToggleSwitch
                enabled={settings.aiAnalysis}
                onChange={(v) => update('aiAnalysis', v)}
              />
            </div>
            <div>
              <label className="text-muted" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Response Tone</label>
              <select
                value={settings.responseTone}
                onChange={(e) => update('responseTone', e.target.value)}
                style={{ maxWidth: '300px' }}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="apologetic">Apologetic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Notifications</h2>
          <div className="flex flex-between">
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Email Alerts</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>Receive email for urgent reviews</div>
            </div>
            <ToggleSwitch
              enabled={settings.emailAlerts}
              onChange={(v) => update('emailAlerts', v)}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <label className="text-muted" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Slack Webhook (optional)</label>
            <input
              type="text"
              placeholder="https://hooks.slack.com/..."
              value={settings.slackWebhook}
              onChange={(e) => update('slackWebhook', e.target.value)}
            />
          </div>
        </div>

        {/* Integrations - Google First & Prominent */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>🔌 Integrations</h2>
          <p className="text-muted" style={{ fontSize: '13px', marginBottom: '16px' }}>
            Connect your review platforms to import and manage reviews in one place.
          </p>
          
          {/* Google - Featured */}
          <div style={{ 
            marginBottom: '20px',
            padding: '20px', 
            background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(52, 168, 83, 0.1) 100%)', 
            borderRadius: '12px',
            border: '1px solid rgba(66, 133, 244, 0.3)'
          }}>
            <div className="flex flex-between" style={{ alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🔍</span> Google Business Profile
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#f59e0b',
                  }}>
                    COMING SOON
                  </span>
                </div>
                <div className="text-muted" style={{ fontSize: '13px', marginBottom: '12px' }}>
                  Import and manage Google reviews inside Reviewability
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  • Automatic review sync • Response directly on Google • Multi-location support
                </div>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ 
                  background: '#4285f4', 
                  opacity: 0.6,
                  cursor: 'not-allowed'
                }}
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div>
          
          {/* Other Integrations */}
          <div className="grid gap-4">
            {integrations.slice(1).map(platform => (
              <div key={platform.name} className="flex flex-between" style={{ 
                padding: '16px', 
                background: 'var(--bg)', 
                borderRadius: '8px',
                border: '1px solid var(--border)'
              }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{platform.icon}</span> {platform.name}
                  </div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>{platform.description}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: `${statusLabels[platform.status].color}20`,
                    color: statusLabels[platform.status].color,
                  }}>
                    {statusLabels[platform.status].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing - Demo State */}
        <div className="card mb-4">
          <div className="flex flex-between" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px' }}>💳 Billing</h2>
            <span style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#f59e0b',
            }}>
              DEMO MODE
            </span>
          </div>
          <p className="text-muted" style={{ fontSize: '13px', marginBottom: '16px' }}>
            Billing integration is in demo mode. Connect Stripe to enable payments.
          </p>
          <div className="flex flex-between" style={{ padding: '16px', background: 'var(--bg)', borderRadius: '8px' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Pro Plan</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>$29/month • Demo mode</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary">Connect Stripe</button>
            </div>
          </div>
        </div>

        {/* Save */}
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button className="btn btn-primary" style={{ padding: '12px 32px' }}>Save Changes</button>
        </div>
      </main>
    </div>
  );
}