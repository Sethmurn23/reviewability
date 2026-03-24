'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import ToggleSwitch from '../../components/ToggleSwitch';
import { defaultSettings, processReviewAutomation } from '../../lib/automation';

// Convert status to settings
function settingsToState(settings: typeof defaultSettings) {
  return {
    autoReply5Star: settings.autoReply5Star,
    autoReply4Star: settings.autoReply4Star,
    requireApproval1to3Star: settings.requireApproval1to3Star,
    businessHoursOnly: settings.businessHoursOnly,
    ownerVoice: settings.ownerVoice,
    toneDefault: settings.toneDefault,
  };
}

export default function AutomationPage() {
  const [settings, setSettings] = useState(defaultSettings);

  const automations = [
    { id: '1', name: 'Reply to all positive reviews', trigger: 'rating >= 4', action: 'auto_respond', isActive: true, runCount: 156, description: 'Auto-reply to 4-5 star reviews with AI-generated response' },
    { id: '2', name: 'Alert on 1-star reviews', trigger: 'rating = 1', action: 'send_email', isActive: true, runCount: 23, description: 'Email owner immediately when 1-star review received' },
    { id: '3', name: 'Auto-respond to complaints', trigger: 'sentiment = negative', action: 'generate_response', isActive: false, runCount: 0, description: 'Generate response for negative reviews (requires approval)' },
    { id: '4', name: 'Weekly digest', trigger: 'schedule = weekly', action: 'send_digest', isActive: true, runCount: 12, description: 'Send weekly summary of all review activity' },
  ];

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 20px' }}>
        <div className="flex flex-between" style={{ marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Automation</h1>
            <p className="text-muted">Configure your review response automation rules</p>
          </div>
          <button className="btn btn-primary">+ Create Automation</button>
        </div>

        {/* Default Settings */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>⚙️ Default Settings</h2>
          
          <div className="grid grid-2 gap-4">
            {/* Auto-reply positive reviews */}
            <div className="flex flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Auto-reply to 5-star reviews</div>
                <div className="text-muted" style={{ fontSize: '12px' }}>Automatically respond to positive reviews</div>
              </div>
              <ToggleSwitch enabled={settings.autoReply5Star} onChange={(v) => updateSetting('autoReply5Star', v)} />
            </div>

            <div className="flex flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Auto-reply to 4-star reviews</div>
                <div className="text-muted" style={{ fontSize: '12px' }}>Optionally auto-respond to 4-star reviews</div>
              </div>
              <ToggleSwitch enabled={settings.autoReply4Star} onChange={(v) => updateSetting('autoReply4Star', v)} />
            </div>

            <div className="flex flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Require approval for 1-3 star reviews</div>
                <div className="text-muted" style={{ fontSize: '12px' }}>Negative/mixed reviews need manual approval</div>
              </div>
              <ToggleSwitch enabled={settings.requireApproval1to3Star} onChange={(v) => updateSetting('requireApproval1to3Star', v)} />
            </div>

            <div className="flex flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Business hours only</div>
                <div className="text-muted" style={{ fontSize: '12px' }}>Only run automations during business hours</div>
              </div>
              <ToggleSwitch enabled={settings.businessHoursOnly} onChange={(v) => updateSetting('businessHoursOnly', v)} />
            </div>

            <div className="flex flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Owner voice</div>
                <div className="text-muted" style={{ fontSize: '12px' }}>Use business name instead of generic responses</div>
              </div>
              <ToggleSwitch enabled={settings.ownerVoice} onChange={(v) => updateSetting('ownerVoice', v)} />
            </div>

            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Default tone</div>
              <select 
                value={settings.toneDefault} 
                onChange={(e) => updateSetting('toneDefault', e.target.value)}
                style={{ maxWidth: '200px' }}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="apologetic">Apologetic</option>
              </select>
            </div>
          </div>

          {/* Guardrails help text */}
          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            background: 'rgba(99, 102, 241, 0.1)', 
            borderRadius: '8px',
            border: '1px solid var(--primary)'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>💡 Automation Guardrails</div>
            <ul style={{ fontSize: '13px', color: 'var(--text-muted)', paddingLeft: '20px' }}>
              <li>Positive reviews (4-5 stars) can be safely auto-replied to increase engagement</li>
              <li>Negative reviews (1-3 stars) should usually require approval to ensure proper handling</li>
              <li>Automation can be limited to business hours to maintain quality control</li>
              <li>Always review draft responses before they go live to protect your brand</li>
            </ul>
          </div>
        </div>

        {/* Rule Preview */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>📋 Current Rules Summary</h2>
          <div className="grid grid-2 gap-4">
            <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px', color: '#22c55e' }}>✅ Auto-handled</div>
              <ul style={{ fontSize: '13px', color: 'var(--text-muted)', paddingLeft: '16px' }}>
                {settings.autoReply5Star && <li>5-star reviews</li>}
                {settings.autoReply4Star && <li>4-star reviews</li>}
              </ul>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px', color: '#f59e0b' }}>⏳ Requires approval</div>
              <ul style={{ fontSize: '13px', color: 'var(--text-muted)', paddingLeft: '16px' }}>
                {settings.requireApproval1to3Star && <li>1-3 star reviews</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Active Automations */}
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>🔧 Automation Workflows</h2>
        
        <div className="grid gap-4">
          {automations.map(automation => (
            <div key={automation.id} className="card">
              <div className="flex flex-between">
                <div>
                  <div className="flex gap-2" style={{ alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{automation.name}</h3>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      background: automation.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                      color: automation.isActive ? 'var(--success)' : 'var(--text-muted)',
                    }}>
                      {automation.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <p className="text-muted" style={{ fontSize: '13px', marginBottom: '8px' }}>{automation.description}</p>
                  <div className="flex gap-4 text-muted" style={{ fontSize: '12px' }}>
                    <span>📌 {automation.trigger}</span>
                    <span>⚡ {automation.action}</span>
                    <span>📊 {automation.runCount} runs</span>
                  </div>
                </div>
                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                  <ToggleSwitch 
                    enabled={automation.isActive} 
                    onChange={() => {}} 
                  />
                  <button className="btn btn-secondary" style={{ padding: '8px 12px' }}>Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create New */}
        <div className="card mt-4" style={{ borderStyle: 'dashed', borderColor: 'var(--border)' }}>
          <div className="text-center" style={{ padding: '20px' }}>
            <p className="text-muted" style={{ marginBottom: '16px' }}>Create a new automation workflow</p>
            <button className="btn btn-primary">+ Add Automation</button>
          </div>
        </div>
      </main>
    </div>
  );
}