import catalogJson from '@/data/catalog.json';

/**
 * 商品資料，來源：Claude Sheet「寶楠 產品型錄」（scripts/build_catalog.py 匯出）。
 * 只含可公開欄位；進價、毛利、進貨渠道、客戶等內部欄位不會進到網站。
 */
export type CatalogItem = {
  sku: string;
  slug: string;
  group: string; // 大類
  category: string; // 類別
  brand: string;
  model: string;
  name: string;
  price: number | null; // 網站售價（未稅 NT$）＝最近成交價 ×1.08；超過 3 年或無資料為 null → 顯示「請詢價」
  price_date: string | null;
  lead_time: string | null; // 參考交期
  spec: string;
  grade: string; // A 常銷 / B 回購 / C 單次
  popularity: number; // 成交次數，只用來排序，不顯示
  image: string | null;
  datasheets: { text: string; href: string }[];
  description: string; // 商品說明（Product Master 產生）
};

export const catalog = catalogJson as CatalogItem[];

/** 大類的顯示順序 */
export const GROUP_ORDER = ['UPS與電力', '感測與量測', '流體控制', '電控與線材', '動力與傳動', '風機與空調', '光源與光學', '其他'];

export type GroupInfo = { group: string; count: number; categories: { category: string; count: number }[] };

export function groups(): GroupInfo[] {
  const map = new Map<string, Map<string, number>>();
  for (const i of catalog) {
    const m = map.get(i.group) ?? new Map<string, number>();
    m.set(i.category, (m.get(i.category) ?? 0) + 1);
    map.set(i.group, m);
  }
  return [...map.entries()]
    .sort((a, b) => GROUP_ORDER.indexOf(a[0]) - GROUP_ORDER.indexOf(b[0]))
    .map(([group, m]) => ({
      group,
      count: [...m.values()].reduce((s, n) => s + n, 0),
      categories: [...m.entries()].sort((a, b) => b[1] - a[1]).map(([category, count]) => ({ category, count })),
    }));
}

export function brandsInCatalog() {
  const m = new Map<string, number>();
  for (const i of catalog) m.set(i.brand, (m.get(i.brand) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([brand, count]) => ({ brand, count }));
}

export function bySlug(slug: string) {
  return catalog.find((i) => i.slug === slug);
}

export function related(item: CatalogItem, n = 4) {
  return catalog
    .filter((i) => i.slug !== item.slug && i.category === item.category)
    .sort((a, b) => Number(b.brand === item.brand) - Number(a.brand === item.brand) || b.popularity - a.popularity)
    .slice(0, n);
}

export const formatPrice = (n: number) => 'NT$ ' + n.toLocaleString('en-US');

/** 含 5% 營業稅 */
export const withTax = (n: number) => Math.round(n * 1.05);

/** 圖片網址：站內路徑補上網域，外部網址原樣回傳 */
export const absUrl = (base: string, u: string) => (/^https?:\/\//.test(u) ? u : base + u);

/** 給列表頁用的精簡欄位（送到瀏覽器） */
export type ListItem = Pick<
  CatalogItem,
  'sku' | 'slug' | 'group' | 'category' | 'brand' | 'model' | 'name' | 'price' | 'lead_time' | 'grade' | 'popularity' | 'image'
>;
export const listItems: ListItem[] = catalog.map(({ sku, slug, group, category, brand, model, name, price, lead_time, grade, popularity, image }) => ({
  sku, slug, group, category, brand, model, name, price, lead_time, grade, popularity, image,
}));
