import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorsDirectory from '@/components/CalculatorsDirectory';
import { calculators } from '@/lib/calculators';
import { categories } from '@/lib/categories';

export default function CalculatorsPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Calculators Free Online',
    url: 'https://numerixhub.tech/calculators/',
    description: 'Browse 200+ free online calculators for finance, health, math, and utility tasks.',
    isPartOf: {
      '@type': 'WebSite',
      name: 'NumerixHub',
      url: 'https://numerixhub.tech/',
    },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://numerixhub.tech/' },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://numerixhub.tech/calculators/' },
    ],
  };
  const calculatorsItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'NumerixHub Calculators',
    numberOfItems: calculators.length,
    itemListElement: calculators
      .slice(0, 120)
      .map((calc, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: calc.name,
        url: `https://numerixhub.tech/${calc.slug}/`,
      })),
  };
  const categoryItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Calculator Categories',
    itemListElement: categories.map((cat, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: cat.name,
      url: `https://numerixhub.tech/calculators/?category=${cat.id}`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorsItemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryItemListSchema) }} />
      <Header />
      <main className="flex-1">
        <CalculatorsDirectory />
      </main>
      <Footer />
    </div>
  );
}
