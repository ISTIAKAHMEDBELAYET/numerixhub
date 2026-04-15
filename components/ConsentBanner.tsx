'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ConsentStatus = 'accepted' | 'rejected' | 'pending';

export default function ConsentBanner() {
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cookieConsent') as ConsentStatus | null;
      if (saved === 'accepted' || saved === 'rejected') {
        setStatus(saved);
        setVisible(false);
      } else {
        // Show banner after a short delay
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setStatus('accepted');
    setVisible(false);
    // Enable GA4 and AdSense tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setStatus('rejected');
    setVisible(false);
    // Disable GA4 and AdSense tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  };

  if (!visible || status !== 'pending') return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-gray-900 dark:bg-gray-950 border-t border-gray-700 shadow-2xl"
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm text-gray-300">
          <p className="font-semibold text-white mb-1">🍪 We use cookies</p>
          <p>
            We use cookies and similar technologies for analytics (Google Analytics 4) and advertising (Google AdSense) to improve your experience and help keep NumerixHub free.{' '}
            <Link href="/cookies/" className="underline text-indigo-400 hover:text-indigo-300 transition-colors">
              Learn more
            </Link>
            {' '}|{' '}
            <Link href="/privacy/" className="underline text-indigo-400 hover:text-indigo-300 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
