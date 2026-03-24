'use client';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

export default function ToggleSwitch({ enabled, onChange, label }: ToggleSwitchProps) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
    }}>
      <div style={{
        width: '48px',
        height: '26px',
        borderRadius: '13px',
        background: enabled ? 'var(--primary)' : 'var(--border)',
        position: 'relative',
        transition: 'all 0.2s',
      }}>
        <div style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: '2px',
          left: enabled ? '24px' : '2px',
          transition: 'all 0.2s',
        }} />
      </div>
      {label && <span style={{ fontSize: '14px' }}>{label}</span>}
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{ display: 'none' }}
      />
    </label>
  );
}