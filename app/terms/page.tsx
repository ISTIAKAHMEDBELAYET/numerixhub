import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service and Usage Rules',
  description: 'NumerixHub Terms of Service - rules and guidelines for using our calculators.',
  alternates: {
    canonical: 'https://numerixhub.tech/terms/',
  },
  openGraph: {
    title: 'Terms of Service and Usage Rules | NumerixHub',
    description: 'Review NumerixHub terms, calculator usage policies, and liability terms.',
    url: 'https://numerixhub.tech/terms/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NumerixHub Terms of Service' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service and Usage Rules | NumerixHub',
    description: 'Review NumerixHub terms and calculator usage policies.',
    images: ['/og-image.png'],
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10">Last updated: January 1, 2025</p>
          <div className="space-y-8 text-gray-600 dark:text-gray-400">
            {[
              {
                title: 'Acceptance of Terms',
                content: 'By accessing and using NumerixHub, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the site.',
              },
              {
                title: 'Use of Calculators',
                content: 'NumerixHub provides calculators for informational and educational purposes only. All calculations are estimates based on standard formulas and may not be appropriate for all situations. You are responsible for verifying results and should not rely solely on these calculators for major financial, medical, or legal decisions.',
              },
