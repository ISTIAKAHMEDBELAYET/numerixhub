import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '404 - Page Not Found | NumerixHub',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-lg">
          <div className="text-8xl mb-6">🧮</div>
          <h1 className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Oops! The page you&apos;re looking for doesn&apos;t exist. It may have been moved or deleted.
            Let&apos;s get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors"
            >
              ← Back to Home
            </Link>
            <Link
              href="/calculators/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Browse Calculators
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
