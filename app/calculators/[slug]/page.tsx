import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorEngine from '@/components/CalculatorEngine';
import { getCalculatorBySlug, calculators } from '@/lib/calculators';

export async function generateStaticParams() {
  return calculators.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) return { title: 'Calculator Not Found' };
  return {
    title: `${calc.name} – NumerixHub`,
    description: calc.description,
  };
}

export default function CalculatorPage({ params }: { params: { slug: string } }) {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/calculators/" className="hover:text-indigo-600">Calculators</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 dark:text-white">{calc.name}</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <CalculatorEngine calc={calc} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
