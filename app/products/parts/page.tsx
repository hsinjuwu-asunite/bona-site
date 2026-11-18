import Link from 'next/link';
import PageShell from '@/components/PageShell';
import ProductCard from '@/components/ProductCard';
import { LETTERS, PAGE_SIZE, products } from '@/lib/data';

type SP = Promise<{ letter?: string; page?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const extra = [sp.letter && `廠牌 ${sp.letter.toUpperCase()}`, sp.page && `第${sp.page}頁`].filter(Boolean).join(' ');
  return {
    title: `PARTS已銷售廠牌產品規格&照片${extra ? '｜' + extra : ''}`,
    description: `寶楠科技已銷售的日本機台設備零組件，共 ${products.length} 項，可依廠牌字母查詢型號、品名與規格。`,
    alternates: {
      canonical:
        '/products/parts' +
        ((q) => (q ? '?' + q : ''))(
          new URLSearchParams({
            ...(sp.letter ? { letter: sp.letter.toUpperCase() } : {}),
            ...(sp.page && sp.page !== '1' ? { page: sp.page } : {}),
          }).toString(),
        ),
    },
  };
}

export default async function Parts({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const letter = sp.letter && LETTERS.includes(sp.letter.toUpperCase()) ? sp.letter.toUpperCase() : undefined;
  const list = letter ? products.filter((p) => p.initial === letter) : products;
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(sp.page) || 1), totalPages);
  const items = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const href = (p: number) => {
    const q = new URLSearchParams();
    if (letter) q.set('letter', letter);
    if (p > 1) q.set('page', String(p));
    const s = q.toString();
    return `/products/parts${s ? '?' + s : ''}`;
  };
  // same 10-page window as the original site
  const start = Math.max(1, Math.min(page - 4, totalPages - 9));
  const pageNums = Array.from({ length: Math.min(10, totalPages) }, (_, i) => start + i);

  return (
    <PageShell
      hero="/images/products_sale.jpg"
      crumbs={[
        { label: '首頁', href: '/' },
        { label: '產品介紹', href: '/products' },
        { label: '日本進口PARTS' },
        { label: 'PARTS已銷售廠牌產品規格&照片', href: '/products/parts' },
      ]}
    >
      <div className="container">
        <div className="main-content">
          <h3 className="title">PARTS已銷售廠牌產品規格&amp;照片</h3>
          <ul className="name-filter">
            {LETTERS.map((l) => (
              <li key={l}>
                <Link href={`/products/parts?letter=${l}`} className={l === letter ? 'active' : undefined}>
                  {l}
                </Link>
              </li>
            ))}
          </ul>
          <div className="product-item-group">
            {items.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
            {items.length === 0 && <p>沒有符合的產品。</p>}
          </div>
          <nav className="pagination-warp">
            <ul className="pagination">
              <li className="page-control">{page > 1 && <Link href={href(page - 1)}>上一頁</Link>}</li>
              {pageNums.map((n) => (
                <li key={n} className="page-numbers">
                  {/* the original theme marks the *other* pages with .active */}
                  <Link href={href(n)} className={n === page ? undefined : 'active'}>
                    {n}
                  </Link>
                </li>
              ))}
              <li className="page-total">
                <span>
                  {page}/{totalPages}
                </span>
              </li>
              <li className="page-control">{page < totalPages && <Link href={href(page + 1)}>下一頁</Link>}</li>
            </ul>
          </nav>
        </div>
      </div>
    </PageShell>
  );
}
