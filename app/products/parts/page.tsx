import PageShell from '@/components/PageShell';
import CatalogBrowser from '@/components/CatalogBrowser';
import { brandsInCatalog, catalog, groups, listItems } from '@/lib/catalog';

export const metadata = {
  title: '產品型錄｜日本進口零組件',
  description: `寶楠科技有銷售實績的日本機台設備零組件與 UPS 相關產品，共 ${catalog.length} 項，可依分類、品牌、型號搜尋，查看參考價與交期並線上詢價。`,
  alternates: { canonical: '/products/parts' },
};

export default function Parts() {
  return (
    <PageShell
      hero="/images/products_sale.jpg"
      crumbs={[{ label: '首頁', href: '/' }, { label: '產品介紹', href: '/products' }, { label: '產品型錄' }]}
    >
      <div className="container">
        <h3 className="title">產品型錄</h3>
        <p className="catalog-intro">
          以下為寶楠科技有實際銷售紀錄的品項，價格為未稅參考價（含稅另加 5%），實際價格與交期以報價單為準，付款方式為銀行匯款。
          型錄中沒有的型號也歡迎詢價，我們可代為向日本原廠詢價。
        </p>
        <CatalogBrowser items={listItems} groups={groups()} brands={brandsInCatalog()} />
      </div>
    </PageShell>
  );
}
