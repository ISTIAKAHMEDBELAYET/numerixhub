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
  const title = `${calc.name} Online – Free | NumerixHub`;
  const rawDesc = `Free ${calc.name} online. ${calc.description} No signup required. Fast and accurate.`;
  const description = rawDesc.length > 160
    ? rawDesc.slice(0, 160).replace(/\s+\S*$/, '')
    : rawDesc;
  return {
    title,
    description,
    keywords: calc.keywords,
    alternates: {
      canonical: `https://numerixhub.pages.dev/calculators/${calc.slug}/`,
    },
    openGraph: {
      title,
      description: calc.description,
      url: `https://numerixhub.pages.dev/calculators/${calc.slug}/`,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${calc.name} – NumerixHub` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: calc.description,
      images: ['/og-image.png'],
    },
  };
}

export default function CalculatorPage({ params }: { params: { slug: string } }) {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) notFound();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: calc.name,
    description: calc.description,
    url: `https://numerixhub.pages.dev/calculators/${calc.slug}/`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://numerixhub.pages.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Calculators',
        item: 'https://numerixhub.pages.dev/calculators/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: calc.name,
        item: `https://numerixhub.pages.dev/calculators/${calc.slug}/`,
      },
    ],
  };

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

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}
