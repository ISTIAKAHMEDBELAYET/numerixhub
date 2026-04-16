'use client';

import Script from 'next/script';

const GA_ID = 'G-NDDGB7MLRH';
const ADSENSE_ID = 'ca-pub-2278011013110319';

export default function Scripts() {
  return (
    <>
      {/* GA4 Consent Mode v2 - set defaults before any tracking fires */}
      <Script id="consent-defaults" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
          });
        `}
      </Script>

      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>

      {/* Google AdSense */}
      <Script
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
    </>
  );
}
