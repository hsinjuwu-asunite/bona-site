import type { MetadataRoute } from 'next';
import { serviceArticles, upsArticles } from '@/lib/data';
import { catalog } from '@/lib/catalog';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE_URL}${p}`;
  return [
    { url: u('/'), priority: 1 },
    { url: u('/about'), priority: 0.8 },
    { url: u('/products'), priority: 0.8 },
    { url: u('/contact'), priority: 0.7 },
    { url: u('/products/japan-brands'), priority: 0.6 },
    { url: u('/products/parts'), priority: 0.7 },
    ...upsArticles.map((a) => ({ url: u(`/products/ups/${a.slug}`), priority: 0.7 })),
    ...serviceArticles.map((a) => ({ url: u(`/service/${a.slug}`), priority: 0.6 })),
    ...catalog.map((p) => ({ url: u(`/products/parts/${p.slug}`), priority: p.grade === 'A' ? 0.6 : 0.5 })),
  ];
}
