import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Calculators Free Online',
  description: 'Browse 200+ free online calculators by category including finance, health, math, and utility tools on NumerixHub.',
  keywords: ['all calculators', 'online calculator directory', 'free calculator tools', 'finance calculator list', 'math calculator list'],
  alternates: {
    canonical: 'https://numerixhub.pages.dev/calculators/',
  },
  openGraph: {
    title: 'All Calculators Free Online | NumerixHub',
    description: 'Browse 200+ free calculators by category on NumerixHub.',
    url: 'https://numerixhub.pages.dev/calculators/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NumerixHub Calculators Directory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Calculators Free Online | NumerixHub',
    description: 'Browse 200+ free calculators by category on NumerixHub.',
    images: ['/og-image.png'],
  },
};

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
