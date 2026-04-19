import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service and Usage Rules',
  description: 'NumerixHub Terms of Service - rules and guidelines for using our calculators.',
  alternates: {
    canonical: 'https://numerixhub.pages.dev/terms/',
  },
  openGraph: {
    title: 'Terms of Service and Usage Rules | NumerixHub',
    description: 'Review NumerixHub terms, calculator usage policies, and liability terms.',
    url: 'https://numerixhub.pages.dev/terms/',
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
              {
                title: 'No Professional Advice',
                content: 'The information provided by NumerixHub calculators does not constitute financial, investment, tax, legal, medical, or other professional advice. Always consult with a qualified professional before making important decisions based on calculator results.',
              },
              {
                title: 'Accuracy',
                content: 'While we strive to ensure all calculators use accurate formulas and produce correct results, NumerixHub makes no warranty, express or implied, about the accuracy, reliability, or completeness of any calculation results. NumerixHub shall not be liable for any errors or omissions.',
              },
              {
                title: 'Intellectual Property',
                content: 'All content on NumerixHub, including calculator logic, design, and text, is the property of NumerixHub and is protected by applicable intellectual property laws. You may use the calculators for personal, non-commercial use. You may not reproduce, sell, or redistribute our calculator software.',
              },
              {
                title: 'Prohibited Uses',
                content: 'You agree not to use NumerixHub in any way that: violates applicable laws or regulations; harms or exploits others; attempts to gain unauthorized access to any system; interferes with the normal operation of the site; or scrapes content without permission.',
              },
              {
                title: 'Limitation of Liability',
                content: 'NumerixHub and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the site or reliance on any information obtained from it.',
              },
              {
                title: 'Changes to Terms',
                content: 'NumerixHub reserves the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the site after changes are posted constitutes acceptance of the new terms.',
              },
            ].map(section => (
              <div key={section.title} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
                <p className="leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


