/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import ProductThumb from '@/components/ProductThumb';
import AddToQuote from '@/components/AddToQuote';
import { absUrl, bySlug, catalog, formatPrice, related, withTax } from '@/lib/catalog';
import { site } from '@/lib/data';
import { SITE_URL } from '@/lib/seo';

export function generateStaticParams() {
  return catalog.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = bySlug(slug);
  if (!i) return {};
  const desc = [
    `${i.brand} ${i.model}（${i.category}）`,
    i.price != null ? `參考價 ${formatPrice(i.price)} 未稅` : '歡迎詢價',
    i.lead_time ? `參考交期 ${i.lead_time}` : '',
    '寶楠科技提供日本機台設備零組件代購與報價。',
  ].filter(Boolean).join('，');
  return {
    title: `${i.brand} ${i.model} ${i.category}`,
    description: desc,
    alternates: { canonical: `/products/parts/${i.slug}` },
    openGraph: i.image ? { images: [absUrl(SITE_URL, i.image)] } : undefined,
  };
}

export default async function PartDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = bySlug(slug);
  if (!i) notFound();
  const rel = related(i);
  const listHref = (q: Record<string, string>) => '/products/parts?' + new URLSearchParams(q).toString();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: i.name,
    sku: i.sku,
    mpn: i.model,
    brand: { '@type': 'Brand', name: i.brand },
    category: `${i.group} > ${i.category}`,
    ...(i.image ? { image: absUrl(SITE_URL, i.image) } : {}),
    ...(i.description ? { description: i.description } : {}),
    ...(i.price != null
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'TWD',
            price: i.price,
            availability: 'https://schema.org/PreOrder',
            seller: { '@type': 'Organization', name: site.name },
            url: `${SITE_URL}/products/parts/${i.slug}`,
          },
        }
      : {}),
  };

  return (
    <PageShell
      hero="/images/products_sale.jpg"
      crumbs={[
        { label: '首頁', href: '/' },
        { label: '產品型錄', href: '/products/parts' },
        { label: i.group, href: listHref({ g: i.group }) },
        { label: i.category, href: listHref({ g: i.group, c: i.category }) },
        { label: i.model },
      ]}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container">
        <div className="pdetail">
          <div className="pdetail__media">
            <ProductThumb item={i} large />
            {!i.image && <p className="pdetail__media-note">商品照片準備中，實際外觀以原廠為準</p>}
          </div>

          <div className="pdetail__info">
            <div className="pdetail__tags">
              <Link href={listHref({ g: i.group, c: i.category })} className="tag">{i.category}</Link>
              {i.grade === 'A' && <span className="tag tag--hot">熱銷</span>}
              {i.grade === 'B' && <span className="tag tag--repeat">回購商品</span>}
            </div>
            <div className="pdetail__brand">
              <Link href={listHref({ b: i.brand })}>{i.brand}</Link>
            </div>
            <h1 className="pdetail__model">{i.model}</h1>
            <p className="pdetail__name">{i.name}</p>

            <div className="pdetail__price">
              {i.price != null ? (
                <>
                  <span className="pdetail__price-num">{formatPrice(i.price)}</span>
                  <span className="pdetail__price-unit">未稅・含稅 {formatPrice(withTax(i.price))}</span>
                </>
              ) : (
                <span className="pdetail__price-num pdetail__price-num--ask">價格請洽詢</span>
              )}
            </div>

            <table className="pdetail__table">
              <tbody>
                <tr><th>參考交期</th><td>{i.lead_time ?? '請洽詢'}</td></tr>
                <tr><th>品牌</th><td>{i.brand}</td></tr>
                <tr><th>型號</th><td>{i.model}</td></tr>
                <tr><th>分類</th><td>{i.group} › {i.category}</td></tr>
                <tr><th>商品編號</th><td>{i.sku}</td></tr>
                {i.spec && <tr><th>規格</th><td>{i.spec}</td></tr>}
                {i.datasheets.length > 0 && (
                  <tr>
                    <th>規格書</th>
                    <td>
                      {i.datasheets.map((d) => (
                        <a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="pdetail__file">
                          {d.text || '下載'} ↗
                        </a>
                      ))}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {i.description && <p className="pdetail__desc">{i.description}</p>}

            <AddToQuote item={i} />

            <ul className="pdetail__notes">
              <li>價格為未稅參考價，日本進口品會隨匯率與原廠價格調整，實際以報價單為準。付款方式為銀行匯款。</li>
              <li>交期為過去實績參考，下單前會再向原廠確認。</li>
              <li>需要急件、替代型號或大量採購，歡迎來電 {site.phone}。</li>
            </ul>
          </div>
        </div>

        {rel.length > 0 && (
          <div className="pdetail__related">
            <h3>同類商品</h3>
            <div className="catalog-grid catalog-grid--4">
              {rel.map((r) => (
                <div key={r.sku} className="pcard">
                  <Link href={`/products/parts/${r.slug}`} className="pcard__img"><ProductThumb item={r} /></Link>
                  <div className="pcard__body">
                    <div className="pcard__brand">{r.brand}</div>
                    <Link href={`/products/parts/${r.slug}`} className="pcard__model">{r.model}</Link>
                    <div className="pcard__meta">
                      <span className="pcard__price">{r.price != null ? formatPrice(r.price) : '請詢價'}</span>
                      {r.lead_time && <span className="pcard__lead">交期 {r.lead_time}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
