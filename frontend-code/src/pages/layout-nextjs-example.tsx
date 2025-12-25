// Next.js App Router Layout Example with Google Analytics
// Place this in: app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import AnalyticsPageTracker from '@/components/AnalyticsPageTracker';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mutual Funds Platform',
  description: 'Compare and analyze mutual funds',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        <AnalyticsPageTracker />
        {children}
      </body>
    </html>
  );
}
