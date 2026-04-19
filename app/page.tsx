import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorCard from '@/components/CalculatorCard';
import FAQAccordion from '@/components/FAQAccordion';
import NewsletterForm from '@/components/NewsletterForm';
import { getFeaturedCalculators, getCalculatorsByCategory } from '@/lib/calculators';
import { categories } from '@/lib/categories';

export const metadata: Metadata = {
  title: 'NumerixHub – 200+ Free Online Calculators',
  description: 'Use 200+ free online calculators for finance, health, math, and utility tasks. Fast, accurate, mobile-friendly tools with no signup required.',
  keywords: ['free online calculators', 'financial calculators', 'health calculators', 'math calculators', 'utility calculators', 'mortgage calculator', 'BMI calculator'],
  alternates: {
    canonical: 'https://numerixhub.pages.dev/',
  },
  openGraph: {
    title: 'NumerixHub – 200+ Free Online Calculators',
    description: 'Use 200+ free online calculators for finance, health, math, and utility tasks. Fast, accurate, mobile-friendly tools.',
    url: 'https://numerixhub.pages.dev/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NumerixHub Free Online Calculators' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NumerixHub – 200+ Free Online Calculators',
    description: 'Use 200+ free online calculators for finance, health, math, and utility tasks.',
    images: ['/og-image.png'],
  },
};

const faqItems = [
  {
    question: 'Are all calculators on NumerixHub free to use?',
    answer: 'Yes! Every calculator on NumerixHub is completely free to use with no registration required. We believe everyone deserves access to accurate calculation tools.',
  },
  {
    question: 'How accurate are the calculations?',
    answer: 'Our calculators use industry-standard formulas and algorithms. Financial calculators use standard amortization formulas, health calculators use validated medical equations, and math calculators use precise arithmetic. Results are for informational purposes and should not replace professional financial or medical advice.',
  },
  {
    question: 'Do I need to create an account to use the calculators?',
    answer: 'No account needed! All calculators work instantly in your browser without any sign-up, login, or personal information required.',
  },
  {
    question: 'Is my data saved or shared?',
    answer: 'All calculations happen entirely in your browser. We do not store, collect, or share any of the numbers you enter. Your financial data and health information stays private on your device.',
  },
  {
    question: 'Can I use NumerixHub on my mobile device?',
    answer: 'Absolutely! NumerixHub is fully responsive and works great on smartphones, tablets, and desktop computers. The interface adapts to any screen size for a comfortable experience.',
  },
  {
    question: 'How many calculators does NumerixHub have?',
    answer: 'NumerixHub features over 200 calculators across four categories: Financial (mortgages, loans, investments, taxes), Health & Fitness (BMI, calories, fitness tracking), Math (scientific, statistics, geometry), and Utility & Other (date/time, conversions, construction).',
  },
  {
    question: 'Can I suggest a new calculator?',
    answer: 'Yes! We love hearing from our users. Visit our Contact page to suggest new calculators or report any issues with existing ones. We regularly add new calculators based on user requests.',
  },
  {
    question: 'Are the financial calculators suitable for professional use?',
    answer: 'Our financial calculators provide excellent estimates for planning and educational purposes. However, for major financial decisions such as purchasing a home or planning retirement, we recommend consulting with a licensed financial advisor who can account for your specific circumstances.',
  },
];

export default function HomePage() {
  const featured = getFeaturedCalculators();
  const financialCount = getCalculatorsByCategory('financial').length;
  const healthCount = getCalculatorsByCategory('health').length;
  const mathCount = getCalculatorsByCategory('math').length;
  const utilityCount = getCalculatorsByCategory('utility').length;

  const categoryCounts: Record<string, number> = {
    financial: financialCount,
    health: healthCount,
    math: mathCount,
    utility: utilityCount,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              ✨ 200+ Free Calculators
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Calculate Anything,
              <br />
              <span className="text-yellow-300">Instantly & Free</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
              From mortgage payments to BMI, compound interest to calorie counts — NumerixHub has over 200 free calculators for every need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/calculators/"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-full shadow-lg hover:bg-yellow-50 transition-all hover:scale-105 text-base"
              >
                Browse All Calculators →
              </Link>
              <Link
                href="/mortgage-calculator/"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-all text-base"
              >
                🏠 Try Mortgage Calculator
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Calculators */}
        <section className="hidden md:block py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Online Calculators</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Most popular tools used by millions</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map(calc => (
                <CalculatorCard key={calc.slug} calculator={calc} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/calculators/"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors"
              >
                View All 200+ Calculators →
              </Link>
            </div>
          </div>
        </section>

        {/* Browse by Category */}
        <section className="hidden md:block py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Calculator Categories</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Find the calculator you need</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/calculators/?category=${cat.id}`}
                  className={`group p-6 rounded-2xl border border-gray-200 dark:border-gray-700 ${cat.bgColor} hover:shadow-lg transition-all hover:-translate-y-1`}
                >
                  <div className="text-4xl mb-3">{cat.emoji}</div>
                  <h3 className={`text-lg font-bold mb-1 ${cat.color}`}>{cat.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{cat.description}</p>
                  <span className={`text-sm font-semibold ${cat.color}`}>
                    {categoryCounts[cat.id]} calculators →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose NumerixHub */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose NumerixHub?</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Built for speed, accuracy, and simplicity</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '⚡', title: 'Lightning Fast', desc: 'Instant calculations with no loading time. Results appear as you type.' },
                { icon: '🔒', title: '100% Private', desc: 'All calculations happen in your browser. We never store your data.' },
                { icon: '📱', title: 'Mobile Friendly', desc: 'Works perfectly on phones, tablets, and desktops. Fully responsive design.' },
                { icon: '🆓', title: 'Always Free', desc: 'Every calculator is completely free. No subscriptions, no hidden fees.' },
                { icon: '✅', title: 'Accurate Results', desc: 'Industry-standard formulas verified by financial and health experts.' },
                { icon: '🎯', title: '200+ Calculators', desc: 'One platform for all your calculation needs across every category.' },
              ].map((benefit, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="text-3xl mb-3">{benefit.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { number: '200+', label: 'Free Calculators' },
                { number: '10M+', label: 'Calculations Done' },
                { number: '4', label: 'Categories' },
                { number: '100%', label: 'Free Forever' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-2">{stat.number}</div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Everything you need to know about NumerixHub</p>
            </div>
            <FAQAccordion items={faqItems} />
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Stay Updated</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Get notified when we add new calculators and features.</p>
          <NewsletterForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
