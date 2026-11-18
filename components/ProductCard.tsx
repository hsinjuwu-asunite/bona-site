import Link from 'next/link';
import type { Product } from '@/lib/data';

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="product-item">
      <div className="product-item__image">
        <Link href={`/products/parts/${p.slug}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {p.image ? <img src={p.image} alt={`${p.brand} ${p.model}`} loading="lazy" /> : null}
        </Link>
      </div>
      <div className="product-item__content">
        <table className="table product-detail-table" cellSpacing={0} width="100%">
          <tbody>
            <tr>
              <td className="hd">廠牌:</td>
              <td className="bd">{p.brand}</td>
            </tr>
            <tr>
              <td className="hd">型號:</td>
              <td className="bd">
                <Link href={`/products/parts/${p.slug}`}>{p.model}</Link>
              </td>
            </tr>
            <tr>
              <td className="hd">品名:</td>
              <td className="bd">{p.name}</td>
            </tr>
            <tr>
              <td className="hd">規格:</td>
              <td className="bd" dangerouslySetInnerHTML={{ __html: p.spec_html }} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
