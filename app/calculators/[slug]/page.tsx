import { notFound } from 'next/navigation';
import { getCalculatorBySlug, calculators } from '@/lib/calculators';

export async function generateStaticParams() {
  return calculators.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) return { title: 'Calculator Not Found' };
  return {
    alternates: {
      canonical: `https://numerixhub.pages.dev/${calc.slug}/`,
    },
  };
}

export default function CalculatorRedirectPage({ params }: { params: { slug: string } }) {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) notFound();

  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0;url=/${calc.slug}/`} />
        <link rel="canonical" href={`https://numerixhub.pages.dev/${calc.slug}/`} />
        <title>Redirecting…</title>
      </head>
      <body>
        <p>
          Redirecting to <a href={`/${calc.slug}/`}>{calc.name}</a>…
        </p>
      </body>
    </html>
  );
}
