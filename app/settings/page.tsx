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

        {/* Integrations */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Integrations</h2>
          <div className="grid gap-4">
            {['Google Business', 'Yelp', 'Trustpilot', 'Facebook'].map(platform => (
              <div key={platform} className="flex flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 600 }}>{platform}</span>
                <button className="btn btn-secondary" style={{ padding: '8px 16px' }}>Connect</button>
              </div>
            ))}
          </div>
        </div>

        {/* Billing */}
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Billing</h2>
          <div className="flex flex-between">
            <div>
              <div style={{ fontWeight: 600 }}>Pro Plan</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>$29/month • Next billing: April 23, 2026</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary">Update Card</button>
              <button className="btn btn-secondary" style={{ color: 'var(--danger)' }}>Cancel</button>
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