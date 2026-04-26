import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy and Data Practices',
  description: 'NumerixHub Privacy Policy - how we handle your data.',
  alternates: {
    canonical: 'https://numerixhub.tech/privacy/',
  },
  openGraph: {
    title: 'Privacy Policy and Data Practices | NumerixHub',
    description: 'Read how NumerixHub handles privacy, analytics, and calculator data processing.',
    url: 'https://numerixhub.tech/privacy/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NumerixHub Privacy Policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy and Data Practices | NumerixHub',
    description: 'Read how NumerixHub handles privacy and calculator data.',
    images: ['/og-image.png'],
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10">Last updated: January 1, 2025</p>
          <div className="space-y-8 text-gray-600 dark:text-gray-400">
            {[
              {
                title: 'Overview',
                content: 'NumerixHub is committed to protecting your privacy. This policy explains what information we collect and how we use it. The short version: we collect very little data, and all calculations are performed locally in your browser.',
              },
