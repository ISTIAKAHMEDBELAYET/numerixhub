import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorEngine from '@/components/CalculatorEngine';
import { getCalculatorBySlug, calculators } from '@/lib/calculators';

const canonicalSlugMap: Record<string, string> = {
  'permutation-combination-calculator': 'permutation-and-combination-calculator',
  'shoe-size-conversion': 'shoe-size-calculator',
  'day-of-the-week-calculator': 'day-of-week-calculator',
};

function getCanonicalSlug(slug: string) {
  return canonicalSlugMap[slug] ?? slug;
}

export async function generateStaticParams() {
  return calculators.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) return { title: 'Calculator Not Found' };

  const canonicalSlug = getCanonicalSlug(params.slug);
  const isAlias = params.slug !== canonicalSlug;
  const canonicalUrl = `https://numerixhub.tech/${canonicalSlug}/`;
  const title = `${calc.name} Free Online`;
  const rawDesc = `Free ${calc.name} online. ${calc.description} No signup required. Fast and accurate.`;
  const description = rawDesc.length > 160
    ? rawDesc.slice(0, 160).replace(/\s+\S*$/, '')
    : rawDesc;

  return {
    title,
    description,
    keywords: calc.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: isAlias
      ? {
        index: false,
        follow: true,
      }
      : undefined,
    openGraph: {
      title: `${calc.name} | NumerixHub`,
      description: calc.description,
      url: canonicalUrl,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${calc.name} - NumerixHub` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${calc.name} | NumerixHub`,
      description: calc.description,
      images: ['/og-image.png'],
    },
  };
}

export default function CalculatorPage({ params }: { params: { slug: string } }) {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) notFound();

  const canonicalSlug = getCanonicalSlug(params.slug);
  const canonicalUrl = `https://numerixhub.tech/${canonicalSlug}/`;

  // Early theme sync script for static export: ensures dark mode before hydration
  const themeScript = `
    (function(){
      function getCookie(name){
        var escaped = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        var match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
      }
      var m = null;
      try { m = localStorage.getItem('darkMode'); } catch (e) {}
      if (m !== 'true' && m !== 'false') {
        var cm = getCookie('darkMode');
        if (cm === 'true' || cm === 'false') m = cm;
      }
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      var shouldUseDark = m === 'true' || (m === null && prefersDark);
      document.documentElement.classList.toggle('dark', shouldUseDark);
    })();
  `;

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: calc.name,
    description: calc.description,
    url: canonicalUrl,
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
        item: 'https://numerixhub.tech',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: calc.name,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <Header />
      <main className="flex-1">
        <nav aria-label="Breadcrumb" className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/calculators/" className="hover:text-indigo-600">Calculators</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900 dark:text-white">{calc.name}</span>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <CalculatorEngine calc={calc} />
        </div>
      </main>
      <Footer />

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
