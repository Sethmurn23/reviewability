import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reviewability - AI-Powered Review Management',
  description: 'Manage, analyze, and respond to customer reviews with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}