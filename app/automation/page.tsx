'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import ToggleSwitch from '../../components/ToggleSwitch';

const mockAutomations = [
  { id: '1', name: 'Reply to all positive reviews', trigger: 'rating >= 4', action: 'auto_respond', isActive: true, runCount: 156 },
  { id: '2', name: 'Alert on 1-star reviews', trigger: 'rating = 1', action: 'send_email', isActive: true, runCount: 23 },
  { id: '3', name: 'Auto-respond to complaints', trigger: 'sentiment = negative', action: 'generate_response', isActive: false, runCount: 0 },
  { id: '4', name: 'Weekly digest', trigger: 'schedule = weekly', action: 'send_digest', isActive: true, runCount: 12 },
];

export default function AutomationPage() {
  const [automations, setAutomations] = useState(mockAutomations);

  const toggle = (id: string) => {
    setAutomations(automations.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
  };

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 20px' }}>
        <div className="flex flex-between" style={{ marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Automation</h1>
            <p className="text-muted">Automate your review responses and alerts</p>
          </div>
          <button className="btn btn-primary">+ Create Automation</button>
        </div>

        {/* Automations List */}
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
                  <div className="flex gap-4 text-muted" style={{ fontSize: '13px' }}>
                    <span>📌 {automation.trigger}</span>
                    <span>⚡ {automation.action}</span>
                    <span>📊 {automation.runCount} runs</span>
                  </div>
                </div>
                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                  <ToggleSwitch 
                    enabled={automation.isActive} 
                    onChange={() => toggle(automation.id)} 
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