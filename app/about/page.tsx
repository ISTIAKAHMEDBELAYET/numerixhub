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
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                NumerixHub was built with one simple goal: to provide free, accurate, and easy-to-use calculators to everyone on the internet. Whether you&apos;re calculating a mortgage payment, planning your fitness journey, solving a math problem, or converting units — we have a tool for you.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What We Offer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { emoji: '💰', title: '80+ Financial Calculators', desc: 'Mortgages, loans, investments, taxes, retirement planning and more.' },
                  { emoji: '❤️', title: '30+ Health Calculators', desc: 'BMI, calories, fitness, pregnancy, nutrition tracking and more.' },
                  { emoji: '🧮', title: '40+ Math Calculators', desc: 'Scientific, statistics, geometry, algebra and more.' },
