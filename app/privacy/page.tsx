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
            <section>
              <h2 className="text-2xl font-bold">Overview</h2>
              <p>
                NumerixHub is committed to protecting your privacy. This policy explains what information we collect and how we use it. The short version: we collect very little data, and all calculations are performed locally in your browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">Information We Collect</h2>
              <p>
                We do not collect personally identifiable information. We do not require registration or login. Calculator inputs are processed entirely in the browser and are not transmitted to our servers. We may collect anonymized usage statistics through analytics to improve the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">Calculator Data</h2>
              <p>Any values you enter into our calculators are processed exclusively in your browser using JavaScript and are not stored or transmitted to NumerixHub.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">Cookies</h2>
              <p>We use a single local storage item to remember your dark/light mode preference. We may use standard analytics cookies to understand aggregate site usage.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">Changes to This Policy</h2>
              <p>We may update this policy from time to time. When we make material changes, we will update the date at the top of this page.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
