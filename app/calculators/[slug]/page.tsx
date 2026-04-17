import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorEngine from '@/components/CalculatorEngine';
import CalculatorSEOContent from '@/components/CalculatorSEOContent';
import { getCalculatorBySlug, calculators } from '@/lib/calculators';
import { getCalculatorSEO } from '@/lib/calculator-seo';

export async function generateStaticParams() {
  return calculators.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) return { title: 'Calculator Not Found' };
  const title = `${calc.name} – Free Online Calculator`;
  const rawDesc = `Free ${calc.name} online. ${calc.description} No signup required. Fast and accurate.`;
  const description = rawDesc.length > 160
    // 160-char limit; slice at 157 to leave room for the 3-char ellipsis
    ? rawDesc.slice(0, 157).replace(/\s+\S*$/, '') + '...'
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
      siteName: 'NumerixHub',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${calc.name} – NumerixHub` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: calc.description,
      images: ['/og-image.png'],
      creator: '@numerixhub',
    },
  };
}

export default function CalculatorPage({ params }: { params: { slug: string } }) {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) notFound();

  const seo = getCalculatorSEO(calc);

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

  const faqSchema = seo.faqs && seo.faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: seo.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

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
          {/* H1 + intro paragraph */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            {calc.emoji} {calc.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
            {seo.intro}
          </p>

          {/* Interactive calculator tool */}
          <CalculatorEngine calc={calc} />

          {/* SEO content: how-to, formula, examples, FAQs, related */}
          <CalculatorSEOContent calc={calc} seo={seo} />
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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </div>
  );
}
