import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'NumerixHub Cookie Policy – Learn about the cookies we use, why we use them, and how you can control them.',
  alternates: {
    canonical: 'https://numerixhub.com/cookies/',
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Cookie Policy</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Last updated: January 2025</p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300">

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">What Are Cookies?</h2>
              <p>Cookies are small text files stored on your device when you visit a website. They help websites function properly, remember your preferences, and provide analytics information. NumerixHub uses a minimal set of cookies to improve your experience.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Cookies We Use</h2>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">1. Essential / Functional Cookies</h3>
              <p>These cookies are necessary for the website to function and cannot be turned off.</p>
              <table className="w-full text-sm border-collapse mt-3">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Cookie Name</th>
                    <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Purpose</th>
                    <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-xs">darkMode</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">Remembers your light/dark mode preference</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">Persistent (localStorage)</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-xs">cookieConsent</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">Stores your cookie consent choice</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">Persistent (localStorage)</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">2. Analytics Cookies (Google Analytics 4)</h3>
              <p>We use Google Analytics 4 to understand how visitors use our site. This helps us improve our calculators and content. These cookies collect anonymous usage data.</p>
              <table className="w-full text-sm border-collapse mt-3">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Cookie Name</th>
                    <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Purpose</th>
                    <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-xs">_ga</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">Distinguishes unique users</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">2 years</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-xs">_ga_*</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">Used to persist session state</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">2 years</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-3 text-sm">Learn more: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Google Privacy Policy</a></p>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">3. Advertising Cookies (Google AdSense)</h3>
              <p>We use Google AdSense to display ads that help keep NumerixHub free. Google may use cookies to show you relevant advertisements.</p>
              <table className="w-full text-sm border-collapse mt-3">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Provider</th>
                    <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Purpose</th>
                    <th className="text-left p-3 border border-gray-200 dark:border-gray-700">More Info</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">Google AdSense</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">Personalized / contextual advertising</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Google Ads Policy</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Managing Your Cookie Preferences</h2>
              <p>You can manage your cookie preferences in several ways:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Our consent banner</strong>: Use the &ldquo;Accept All&rdquo; or &ldquo;Reject&rdquo; buttons shown when you first visit.</li>
                <li><strong>Browser settings</strong>: Most browsers allow you to control cookies through their settings. Blocking all cookies may affect site functionality.</li>
                <li><strong>Google opt-out</strong>: Use the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Google Analytics Opt-Out Browser Add-on</a>.</li>
                <li><strong>Ad personalization</strong>: Manage at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Google Ads Settings</a>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">GDPR &amp; CCPA</h2>
              <p>We comply with GDPR (EU) and CCPA (California) requirements. Analytics and advertising cookies are only activated after you give consent via our cookie banner. You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Know what data is collected about you</li>
                <li>Opt out of non-essential cookies at any time</li>
                <li>Request deletion of your data (contact us)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Contact Us</h2>
              <p>If you have questions about our cookie policy, please <Link href="/contact/" className="text-indigo-600 dark:text-indigo-400 hover:underline">contact us</Link> or visit our <Link href="/privacy/" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
