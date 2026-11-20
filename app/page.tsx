import Link from 'next/link';
import ProductThumb from '@/components/ProductThumb';
import { catalog, formatPrice, groups } from '@/lib/catalog';
import { site } from '@/lib/data';

const parts = (q: Record<string, string>) => '/products/parts?' + new URLSearchParams(q).toString();

// 首頁用到的數字都從型錄資料算，型錄更新後自動跟著變
const total = catalog.length;
const brandCount = new Set(catalog.map((i) => i.brand)).size;
const pricedCount = catalog.filter((i) => i.price != null).length;
const popular = [...catalog].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
const exampleModels = ['BY50FW', 'PBA150F-24-N', 'LG100-110', 'PJG-20-N'];

const topBrands = (() => {
  const m = new Map<string, number>();
  for (const i of catalog) m.set(i.brand, (m.get(i.brand) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 24);
})();

const partGroups = groups().filter((g) => g.group !== 'UPS與電力');
const upsGroup = groups().find((g) => g.group === 'UPS與電力');

const steps = [
  { t: '找型號', d: '在型錄搜尋型號或品牌。型錄裡沒有的型號，也可以直接寫在詢價單上。' },
  { t: '送出詢價單', d: '把需要的品項和數量加入詢價單，留下公司與聯絡方式後送出。' },
  { t: '收到報價單', d: '業務向原廠確認價格與交期後，以正式報價單回覆。' },
  { t: '銀行匯款', d: '確認報價後下單並匯款。目前只接受銀行匯款，不提供線上刷卡。' },
  { t: '出貨', d: '收到款項後依報價單上的交期安排出貨。' },
];

const panelMakers = [
  { name: '友達光電', note: '新竹、龍潭、台中各廠' },
  { name: '群創光電', note: 'FAB 1–8' },
  { name: '中華映管', note: '龍潭 L1A、L1B、L2' },
  { name: '瀚宇彩晶', note: '' },
  { name: '凌巨科技', note: '八德廠' },
  { name: '元太科技', note: '' },
];
const japanese = ['迪恩仕（SCREEN）', 'Tokyo Electron', '佳能半導體設備', '華氣社（Taikisha）', '光洋林博（KOYO）', '東洋空調工程'];

export default function Home() {
  return (
    <>
      <section className="hm-hero">
        <div className="wrap hm-hero__grid">
          <div className="hm-hero__text">
            <h1 className="hm-hero__title">
              <span className="hm-hero__line">日本設備零件、工業級 UPS</span>
              <span className="hm-hero__line">從型號開始找。</span>
            </h1>
            <p className="hm-hero__lead">
              寶楠科技自 {site.founded.slice(0, 4)} 年起為台灣的面板與半導體廠代購日本原廠零件。型錄收錄 {total} 個我們實際賣過的型號，
              其中 {pricedCount} 個標有參考價與交期。
            </p>
            <form className="hm-search" action="/products/parts" method="get" role="search">
              <label htmlFor="hm-q" className="hm-search__label">
                輸入型號、品牌或品名
              </label>
              <div className="hm-search__row">
                <input id="hm-q" name="q" type="search" className="hm-search__input" placeholder="例如 BY50FW" autoComplete="off" />
                <button type="submit" className="hm-search__btn">
                  搜尋型錄
                </button>
              </div>
              <p className="hm-search__eg">
                常查：
                {exampleModels.map((m) => (
                  <a key={m} href={parts({ q: m })}>
                    {m}
                  </a>
                ))}
              </p>
            </form>
          </div>
          <figure className="hm-hero__fig">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/home-datacenter.jpg" alt="機房內的三相不斷電系統機櫃" width={810} height={423} />
          </figure>
        </div>
      </section>

      <section className="hm-lines wrap" aria-labelledby="hm-lines-h">
        <h2 id="hm-lines-h" className="hm-h2">
          兩條產品線
        </h2>
        <div className="hm-lines__grid">
          <div className="hm-line hm-line--ups">
            <h3 className="hm-line__title">
              <Link href="/products/ups/what-is-ups">工業級不斷電系統 UPS</Link>
            </h3>
            <p>
              OMRON、MITSUBISHI、APC 等機種與替換電池，也提供維護保養與點檢。台中辦事處就近支援中部科學園區。
            </p>
            <ul className="hm-line__links">
              <li><a href={parts({ g: 'UPS與電力', c: 'UPS不斷電系統' })}>UPS 主機</a></li>
              <li><a href={parts({ g: 'UPS與電力', c: 'UPS電池/電池組' })}>UPS 電池／電池組</a></li>
              <li><Link href="/products/ups/ups-sales-record">UPS 銷售實績</Link></li>
              <li><Link href="/service/ups-maintenance">維護保養說明</Link></li>
            </ul>
            {upsGroup && <p className="hm-line__count">型錄中電力類 {upsGroup.count} 項</p>}
          </div>
          <div className="hm-line hm-line--parts">
            <h3 className="hm-line__title">
              <Link href="/products/parts">日本進口原廠零件</Link>
            </h3>
            <p>機台上的感測器、閥件、接頭、馬達與光源。給我們型號，我們向日本原廠詢價、訂貨。</p>
            <ul className="hm-index">
              {partGroups.map((g) => (
                <li key={g.group}>
                  <a href={parts({ g: g.group })}>
                    <span>{g.group}</span>
                    <span className="hm-index__n">{g.count}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="hm-pop" aria-labelledby="hm-pop-h">
        <div className="wrap">
          <div className="hm-headrow">
            <h2 id="hm-pop-h" className="hm-h2">
              最常被詢價的品項
            </h2>
            <Link href="/products/parts" className="hm-more">
              看全部 {total} 項
            </Link>
          </div>
          <ol className="hm-pop__list">
            {popular.map((i) => (
              <li key={i.sku} className="hm-pop__row">
                <Link href={`/products/parts/${i.slug}`} className="hm-pop__img" tabIndex={-1} aria-hidden="true">
                  <ProductThumb item={i} />
                </Link>
                <div className="hm-pop__id">
                  <span className="hm-pop__brand">{i.brand}</span>
                  <Link href={`/products/parts/${i.slug}`} className="hm-pop__model">
                    {i.model}
                  </Link>
                  <span className="hm-pop__cat">{i.category}</span>
                </div>
                <div className="hm-pop__lead">
                  <span className="hm-pop__k">參考交期</span>
                  {i.lead_time ?? '詢問'}
                </div>
                <div className="hm-pop__price">
                  {i.price != null ? (
                    <>
                      {formatPrice(i.price)}
                      <span className="hm-pop__k">未稅</span>
                    </>
                  ) : (
                    <span className="hm-pop__ask">請詢價</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hm-flow wrap" aria-labelledby="hm-flow-h">
        <h2 id="hm-flow-h" className="hm-h2">
          怎麼跟我們買
        </h2>
        <ol className="hm-flow__steps">
          {steps.map((s, n) => (
            <li key={s.t}>
              <span className="hm-flow__n">{n + 1}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
        <p className="hm-flow__note">
          網站價格為未稅參考價，含稅另加 5%；實際價格與交期以報價單為準。
          <Link href="/quote">打開詢價單</Link>
        </p>
      </section>

      <section className="hm-refs" aria-labelledby="hm-refs-h">
        <div className="wrap hm-refs__grid">
          <div>
            <h2 id="hm-refs-h" className="hm-h2">
              合作過的客戶
            </h2>
            <p className="hm-refs__intro">
              我們從 TFT-LCD 產線起家，二十多年來的客戶多是面板廠與在台日系設備商。完整名單見
              <Link href="/about">公司簡介</Link>。
            </p>
          </div>
          <div className="hm-refs__cols">
            <div>
              <h3>面板與電子廠</h3>
              <ul>
                {panelMakers.map((p) => (
                  <li key={p.name}>
                    {p.name}
                    {p.note && <span>{p.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>日系設備與工程商</h3>
              <ul>
                {japanese.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="hm-brands wrap" aria-labelledby="hm-brands-h">
        <div className="hm-headrow">
          <h2 id="hm-brands-h" className="hm-h2">
            常見品牌
          </h2>
          <Link href="/products/japan-brands" className="hm-more">
            全部 {brandCount} 個品牌
          </Link>
        </div>
        <ul className="hm-brands__list">
          {topBrands.map(([b, n]) => (
            <li key={b}>
              <a href={parts({ b })}>
                {b}
                <span>{n}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="hm-ask">
        <div className="wrap hm-ask__in">
          <div>
            <h2 className="hm-ask__title">型錄裡找不到你要的型號？</h2>
            <p>把型號和數量寫給我們，我們向日本原廠查價格與交期。</p>
          </div>
          <div className="hm-ask__actions">
            <Link href="/quote" className="bbtn bbtn--light">
              填寫詢價單
            </Link>
            <a href={`tel:${site.phone.replace(/-/g, '')}`} className="hm-ask__tel">
              {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
