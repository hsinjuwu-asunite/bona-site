import siteJson from '@/data/site.json';
import pagesJson from '@/data/pages.json';
import articlesJson from '@/data/articles.json';
import brandsJson from '@/data/brands.json';

export type Article = {
  id: number | string;
  slug: string;
  section: 'ups' | 'service';
  category: string;
  category_label: string;
  title: string;
  order: number;
  old_url: string;
  hero: string | null;
  html: string;
};

export type Brand = {
  item: string;
  name_en: string;
  name: string;
  products: string;
  file: string | null;
};

export const site = siteJson;
export const pages = pagesJson;
export const articles = articlesJson as Article[];
export const brands = brandsJson as Brand[];

export const upsArticles = articles
  .filter((a) => a.section === 'ups')
  .sort((a, b) => a.order - b.order);
export const serviceArticles = articles.filter((a) => a.section === 'service');

export const upsCategories = [
  { key: 'ups-tech', label: 'UPS技術說明', oldClassId: 3 },
  { key: 'ups-spec', label: 'UPS規格說明', oldClassId: 4 },
  { key: 'ups-data', label: 'UPS相關資料', oldClassId: 5 },
  { key: 'ups-sales', label: 'UPS銷售實績', oldClassId: 6 },
];

export function articlesIn(category: string) {
  return upsArticles.filter((a) => a.category === category);
}

export type NavItem = { label: string; href?: string; children?: NavItem[] };

export const nav: NavItem[] = [
  { label: 'HOME', href: '/' },
  { label: '公司簡介', href: '/about' },
  {
    label: '產品介紹',
    href: '/products',
    children: [
      {
        label: 'UPS不斷電系統',
        children: upsCategories.map((c) =>
          c.key === 'ups-sales'
            ? { label: c.label, href: '/products/ups/ups-sales-record' }
            : {
                label: c.label,
                children: articlesIn(c.key).map((a) => ({ label: a.title, href: `/products/ups/${a.slug}` })),
              },
        ),
      },
      {
        label: '日本進口PARTS',
        children: [
          { label: '產品型錄', href: '/products/parts' },
          { label: '日本廠牌', href: '/products/japan-brands' },
        ],
      },
    ],
  },
  {
    label: 'UPS售後服務與維修保養',
    children: serviceArticles.map((a) => ({ label: a.title, href: `/service/${a.slug}` })),
  },
  { label: '產品型錄', href: '/products/parts' },
  { label: '聯絡我們', href: '/contact' },
];
