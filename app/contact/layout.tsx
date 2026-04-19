import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact and Support',
  description: 'Contact NumerixHub for calculator suggestions, bug reports, and support questions.',
  keywords: ['contact numerixhub', 'calculator support', 'report calculator issue', 'calculator suggestion'],
  alternates: {
    canonical: 'https://numerixhub.pages.dev/contact/',
  },
  openGraph: {
    title: 'Contact and Support',
    description: 'Reach out to NumerixHub for support, suggestions, and feedback.',
    url: 'https://numerixhub.pages.dev/contact/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact NumerixHub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact and Support',
    description: 'Reach out to NumerixHub for support, suggestions, and feedback.',
    images: ['/og-image.png'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
