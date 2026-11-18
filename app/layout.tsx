import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import BackToTop from '@/components/BackToTop';
import { nav, site } from '@/lib/data';
import { DEFAULT_DESCRIPTION, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${site.name}｜工業級 UPS 不斷電系統・日本進口零組件`, template: `%s | ${site.name}` },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: site.name,
    images: ['/upload/ad/cg9xaelh20180531071156.jpg'],
  },
  alternates: { canonical: './' },
  keywords: site.keywords,
  icons: { icon: '/favicons/favicon.ico' },
};

export const viewport = { width: 'device-width', initialScale: 1 };

// Original site stylesheets, kept as-is so the new site looks identical.
const legacyCss = ['bootstrap', 'font-awesome', 'flexnav', 'style', 'site'];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant-TW">
      <head>
        {legacyCss.map((c) => (
          <link key={c} rel="stylesheet" href={`/css/${c}.css`} precedence="default" />
        ))}
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: site.name,
              alternateName: site.name_en,
              url: SITE_URL,
              logo: `${SITE_URL}/images/logo.png`,
              foundingDate: '1997-02',
              telephone: site.phone_intl,
              faxNumber: site.fax,
              address: {
                '@type': 'PostalAddress',
                streetAddress: '新生南路3段6號2樓',
                addressLocality: '大安區',
                addressRegion: '台北市',
                postalCode: '106',
                addressCountry: 'TW',
              },
            }),
          }}
        />
        <div id="container" className="fixed-header">
          <Header nav={nav} address={site.address} phone={site.phone} hours={site.hours} />
          {children}
          <div className="footer">
            <div className="container clearfix">
              <div className="footer-info">
                <h2 className="footer-info__title">{site.name}</h2>
                <p className="footer-info__text">
                  公司電話：{site.phone}
                  <br />
                  公司地址：{site.address}
                  <br />
                  {site.copyright}
                </p>
              </div>
            </div>
          </div>
          <BackToTop />
        </div>
      </body>
    </html>
  );
}
