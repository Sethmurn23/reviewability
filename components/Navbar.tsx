'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/reviews', label: 'Reviews', icon: '⭐' },
  { href: '/automation', label: 'Automation', icon: '⚡' },
  { href: '/insights', label: 'Insights', icon: '💡' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container flex flex-between flex-center" style={{ height: '64px' }}>
        <Link href="/dashboard" style={{ 
          fontSize: '20px', 
          fontWeight: 800, 
          color: 'var(--text)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span>🤖</span> Reviewability
          <span style={{
            background: '#f59e0b',
            color: '#000',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 700,
          }}>DEMO</span>
        </Link>

        <div className="flex gap-2" style={{ display: 'flex', gap: '8px' }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: pathname === item.href ? 'var(--primary)' : 'var(--text-muted)',
                background: pathname === item.href ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                fontWeight: 500,
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ marginRight: '6px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-4">
          <Link href="/settings" className="btn btn-secondary">
            My Account
          </Link>
        </div>
      </div>
    </nav>
  );
}