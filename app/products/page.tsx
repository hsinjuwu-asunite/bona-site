import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { articlesIn, upsCategories } from '@/lib/data';

export const metadata = {
  title: '產品介紹',
  description: 'UPS 不斷電系統技術說明、規格、相關資料與銷售實績，以及日本進口零組件（Parts）廠牌與已銷售產品規格。',
};

export default function Catalog() {
  return (
    <PageShell hero="/images/banner1.jpg" crumbs={[{ label: '首頁', href: '/' }, { label: '產品介紹' }]}>
      <div className="container">
        <div className="category">
          <h3 className="category-title">UPS 不斷電系統</h3>
          <ul className="category-info-list">
            {upsCategories.map((c) => (
              <li key={c.key}>
                <Link href={`/products/ups/${articlesIn(c.key)[0]?.slug ?? 'ups-sales-record'}`}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="category">
          <h3 className="category-title">日本進口 Parts</h3>
          <ul className="category-info-list">
            <li><Link href="/products/japan-brands">日本廠牌</Link></li>
            <li><Link href="/products/parts">已銷售牌 產品規格&amp;照片</Link></li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
