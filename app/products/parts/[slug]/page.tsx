import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import { products } from '@/lib/data';

// New on this site: one page per part (good for SEO, and the future product page of the shop).
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.brand} ${p.model} ${p.name}`,
    description: `${p.brand} ${p.model}（${p.name}）${p.spec_text ? '，規格：' + p.spec_text.slice(0, 80) : ''}。寶楠科技提供日本機台設備零組件，歡迎詢價。`,
    openGraph: p.image ? { images: [p.image] } : undefined,
  };
}

export default async function PartDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <PageShell
      hero="/images/products_sale.jpg"
      crumbs={[
        { label: '首頁', href: '/' },
        { label: '產品介紹', href: '/products' },
        { label: 'PARTS已銷售廠牌產品規格&照片', href: '/products/parts' },
        { label: `${p.brand} ${p.model}` },
      ]}
    >
      <div className="container">
        <div className="main-content">
          <h3 className="title">
            {p.brand} {p.model}
          </h3>
          <div className="product-item-group">
            <div className="product-item">
              <div className="product-item__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.image && <img src={p.image} alt={`${p.brand} ${p.model}`} />}
              </div>
              <div className="product-item__content">
                <table className="table product-detail-table" cellSpacing={0} width="100%">
                  <tbody>
                    <tr><td className="hd">廠牌:</td><td className="bd">{p.brand}</td></tr>
                    <tr><td className="hd">型號:</td><td className="bd">{p.model}</td></tr>
                    <tr><td className="hd">品名:</td><td className="bd">{p.name}</td></tr>
                    <tr><td className="hd">規格:</td><td className="bd" dangerouslySetInnerHTML={{ __html: p.spec_html }} /></tr>
                  </tbody>
                </table>
                {/* Placeholder for the upcoming shop / AI quotation flow */}
                <p style={{ marginTop: 20 }}>
                  <Link href={`/contact?subject=${encodeURIComponent(`詢價：${p.brand} ${p.model}`)}`} className="btn btn-primary">
                    詢價 / Request a quote
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <p>
            <Link href={`/products/parts?letter=${p.initial}`}>← 回到 {p.initial} 開頭的廠牌</Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
