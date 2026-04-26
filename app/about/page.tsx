import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About NumerixHub and Our Mission',
  description: 'Learn about NumerixHub, the home of 200+ free online calculators for math, finance, health, and more.',
  alternates: {
    canonical: 'https://numerixhub.tech/about/',
  },
  openGraph: {
    title: 'About NumerixHub and Our Mission | NumerixHub',
    description: 'Learn about NumerixHub and our 200+ free calculators for finance, health, math, and utility use cases.',
    url: 'https://numerixhub.tech/about/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About NumerixHub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About NumerixHub and Our Mission | NumerixHub',
    description: 'Learn about NumerixHub and our 200+ free calculators.',
    images: ['/og-image.png'],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-6xl">🧮</span>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-4 mb-4">About NumerixHub</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">Making calculations accessible to everyone</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                NumerixHub was built to provide free, accurate, and easy-to-use calculators to everyone on the internet. Whether you need to compute a mortgage, calculate BMI, convert units, or solve a math problem, our goal is to make those tools fast, private, and accessible without signup.
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What We Offer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-2xl">💰</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">80+ Financial Calculators</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mortgages, loans, investments, taxes, retirement planning and more.</p>
                  </div>
                </div>

                <div className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-2xl">❤️</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">30+ Health Calculators</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">BMI, calories, fitness, pregnancy, nutrition tracking and more.</p>
                  </div>
                </div>

                <div className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-2xl">🧮</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">40+ Math Calculators</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Scientific, statistics, geometry, algebra and more.</p>
                  </div>
                </div>

                <div className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-2xl">🔧</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">50+ Utility Calculators</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date, time, conversion, construction, electronics and more.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Commitment</h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li>🆓 Always free — no subscription, no hidden fees</li>
                <li>🔒 Privacy first — all calculations run in your browser</li>
                <li>✅ Accurate — verified formulas used by professionals</li>
                <li>📱 Mobile-friendly — works on any device</li>
                <li>⚡ Fast — instant results as you type</li>
                <li>♿ Accessible — built with accessibility in mind</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
