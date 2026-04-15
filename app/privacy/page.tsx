import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy – NumerixHub',
  description: 'NumerixHub Privacy Policy – how we handle your data.',
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
              {
                title: 'Information We Collect',
                content: 'We do not collect any personally identifiable information. We do not require registration or login. All calculator inputs are processed entirely in your web browser and are never transmitted to our servers. We may collect anonymized usage statistics (page views, session duration) through standard analytics tools to help us improve the site.',
              },
              {
                title: 'Calculator Data',
                content: 'Any values you enter into our calculators (financial figures, health measurements, etc.) are processed exclusively in your browser using JavaScript. This data is never stored, logged, or transmitted to NumerixHub or any third party. When you close your browser tab, this data is gone.',
              },
              {
                title: 'Cookies',
                content: 'We use a single local storage item to remember your dark/light mode preference. This is a functional feature that does not track you. We may use standard analytics cookies (such as Google Analytics) to understand aggregate site usage. You can opt out of analytics tracking by using browser privacy extensions or your browser settings.',
              },
              {
                title: 'Third-Party Services',
                content: 'We may use third-party analytics services that collect anonymized data about site usage. These services operate under their own privacy policies. We do not sell or share any personal information with third parties for marketing purposes.',
              },
              {
                title: 'Children\'s Privacy',
                content: 'NumerixHub is not directed at children under 13. We do not knowingly collect personal information from children.',
              },
              {
                title: 'Changes to This Policy',
                content: 'We may update this privacy policy from time to time. Changes will be posted on this page with an updated date.',
              },
              {
                title: 'Contact Us',
                content: 'If you have questions about this privacy policy, please contact us at hello@numerixhub.com.',
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
