import type { Metadata } from 'next';
import Scripts from '@/app/_components/Scripts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://numerixhub.com'),
  title: {
    default: 'NumerixHub – 200+ Free Online Calculators',
    template: '%s | NumerixHub – Free Calculators',
  },
  description: 'Free online calculators for math, finance, health & fitness, and more. 200+ accurate tools. No signup required. Fast, private, and mobile-friendly.',
  keywords: ['free calculator', 'online calculator', 'math calculator', 'finance calculator', 'health calculator', 'BMI calculator', 'mortgage calculator'],
  authors: [{ name: 'NumerixHub' }],
  creator: 'NumerixHub',
  publisher: 'NumerixHub',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://numerixhub.com',
    siteName: 'NumerixHub',
    title: 'NumerixHub – 200+ Free Online Calculators',
    description: 'Free online calculators for math, finance, health & fitness, and more. 200+ accurate tools. No signup required.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NumerixHub – Free Online Calculators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NumerixHub – 200+ Free Online Calculators',
    description: 'Free online calculators for math, finance, health & fitness. No signup. 100% free.',
    images: ['/og-image.png'],
    creator: '@numerixhub',
  },
  alternates: {
    canonical: 'https://numerixhub.com',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NumerixHub',
    url: 'https://numerixhub.com',
    logo: 'https://numerixhub.com/logo.png',
    description: 'Free online calculators for math, finance, health & fitness, and more.',
    sameAs: [
      'https://twitter.com/numerixhub',
      'https://facebook.com/numerixhub',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NumerixHub',
    url: 'https://numerixhub.com',
    description: 'Free online calculators for math, finance, health & fitness, and more.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://numerixhub.com/calculators/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Dark mode init - must be first to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('darkMode');if(m==='true'||(!m&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Scripts />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
