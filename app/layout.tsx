import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import BackToTop from '@/components/BackToTop';
import Footer from '@/components/Footer';
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

// 舊站樣式（內容頁仍沿用其版面），之後載入 site.css 與新版外觀 theme.css 覆寫
const legacyCss = ['bootstrap', 'font-awesome', 'style', 'site', 'theme'];
const FONTS =
  'https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600&family=Noto+Sans+TC:wght@400;500;700&display=swap';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
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
        <div id="container">
          <Header nav={nav} phone={site.phone} />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </div>
      </body>
    </html>
  );
}
