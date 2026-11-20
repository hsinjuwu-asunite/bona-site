import Link from 'next/link';
import { catalog } from '@/lib/catalog';
import { site } from '@/lib/data';

const parts = (q: Record<string, string>) => '/products/parts?' + new URLSearchParams(q).toString();
const exampleModels = ['BY50FW', 'PBA150F-24-N', 'LG100-110', 'PJG-20-N'];

// 客戶實績：有取得公司標誌的放 logo，其餘列在下方文字
const customers = [
  { name: '友達光電 AUO', logo: 'auo.svg' },
  { name: '群創光電 Innolux', logo: 'innolux.svg' },
  { name: '瀚宇彩晶 HannStar', logo: 'hannstar.png' },
  { name: '元太科技 E Ink', logo: 'eink.svg' },
  { name: '凌陽科技 Sunplus', logo: 'sunplus.svg' },
  { name: '迪恩仕 SCREEN', logo: 'screen.svg' },
  { name: 'Tokyo Electron', logo: 'tel.svg' },
  { name: '佳能半導體設備 Canon', logo: 'canon.svg' },
  { name: '華氣社 Taikisha', logo: 'taikisha.svg' },
];
const otherCustomers = ['中華映管', '凌巨科技', '太洋新技', '光洋林博', '東洋空調工程', 'YAC'];

// 銷售日系品牌：logo 檔名 → 型錄中的品牌名稱（點了帶到型錄篩選）
const brandLogos: { logo: string; name: string; brand: string }[] = [
  { logo: 'omron.svg', name: 'OMRON', brand: 'OMRON' },
  { logo: 'mitutoyo.svg', name: 'Mitutoyo', brand: 'MITUTOYO' },
  { logo: 'koganei.png', name: 'KOGANEI', brand: 'KOGANEI' },
  { logo: 'melco.svg', name: '三菱電機', brand: 'MITSUBISHI' },
  { logo: 'cosel.svg', name: 'COSEL', brand: 'COSEL' },
  { logo: 'yaskawa.svg', name: 'YASKAWA', brand: 'YASKAWA' },
  { logo: 'kitz.svg', name: 'KITZ', brand: 'KITZ' },
  { logo: 'magnescale.png', name: 'Magnescale', brand: 'MAGNESCALE' },
  { logo: 'convum.png', name: 'CONVUM', brand: 'CONVUM' },
  { logo: 'saginomiya.svg', name: '鷺宮製作所', brand: 'SAGINOMIYA' },
  { logo: 'panasonic.svg', name: 'Panasonic', brand: 'PANASONIC' },
  { logo: 'ulvac.svg', name: 'ULVAC', brand: 'ULVAC' },
  { logo: 'tdk.svg', name: 'TDK-Lambda', brand: 'TDK-LAMBDA' },
  { logo: 'chino.svg', name: 'CHINO', brand: 'CHINO' },
  { logo: 'keyence.svg', name: 'KEYENCE', brand: 'KEYENCE' },
  { logo: 'horiba.svg', name: 'HORIBA', brand: 'HORIBA' },
  { logo: 'thk.svg', name: 'THK', brand: 'THK' },
  { logo: 'fuji.svg', name: '富士電機', brand: 'FUJI' },
  { logo: 'smc.svg', name: 'SMC', brand: 'SMC' },
  { logo: 'hitachi.svg', name: 'HITACHI', brand: 'HITACHI' },
  { logo: 'sony.svg', name: 'SONY', brand: 'SONY' },
  { logo: 'ushio.svg', name: 'USHIO', brand: 'USHIO' },
  { logo: 'gsyuasa.svg', name: 'GS YUASA', brand: 'YUASA' },
  { logo: 'fanuc.svg', name: 'FANUC', brand: 'FANUC' },
  { logo: 'azbil.jpg', name: 'azbil', brand: 'AZBIL' },
  { logo: 'iwaki.svg', name: 'IWAKI', brand: 'IWAKI' },
  { logo: 'nidec.svg', name: 'Nidec', brand: 'NIDEC SANKYO' },
  { logo: 'oriental.svg', name: 'Oriental Motor', brand: 'ORIENTAL MOTOR' },
  { logo: 'toshiba.svg', name: 'TOSHIBA', brand: 'TOSHIBA' },
  { logo: 'sumitomo.svg', name: '住友重機械', brand: 'SUMITOMO' },
  { logo: 'nsk.svg', name: 'NSK', brand: 'NSK' },
  { logo: 'ckd.svg', name: 'CKD', brand: 'CKD' },
  { logo: 'daikin.svg', name: 'DAIKIN', brand: 'DAIKIN' },
];
const brandCount = new Set(catalog.map((i) => i.brand)).size;

export default function Home() {
  return (
    <>
      <section className="hm-hero">
        <div className="wrap hm-hero__grid">
          <div className="hm-hero__text">
            <h1 className="hm-hero__title">
              <span className="hm-hero__line">日本設備原廠零組件</span>
              <span className="hm-hero__line">從型號開始找。</span>
            </h1>
            <p className="hm-hero__lead">寶楠科技自 {site.founded.slice(0, 4)} 年起為台灣的面板與半導體廠供應日本原廠零組件。</p>
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

      <section className="hm-logos" aria-labelledby="hm-refs-h">
        <div className="wrap">
          <h2 id="hm-refs-h" className="hm-h2">
            客戶實績
          </h2>
          <ul className="hm-logos__grid hm-logos__grid--cust">
            {customers.map((c) => (
              <li key={c.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/logos/${c.logo}`} alt={c.name} title={c.name} loading="lazy" />
              </li>
            ))}
          </ul>
          <p className="hm-logos__more">
            其他客戶：{otherCustomers.join('、')}。完整實績見<Link href="/about">公司簡介</Link>。
          </p>
        </div>
      </section>

      <section className="hm-logos hm-logos--brands" aria-labelledby="hm-brands-h">
        <div className="wrap">
          <div className="hm-headrow">
            <h2 id="hm-brands-h" className="hm-h2">
              銷售日系品牌
            </h2>
            <Link href="/products/japan-brands" className="hm-more">
              全部 {brandCount} 個品牌
            </Link>
          </div>
          <ul className="hm-logos__grid">
            {brandLogos.map((b) => (
              <li key={b.logo}>
                <a href={parts({ b: b.brand })} title={`${b.name} 的商品`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/logos/${b.logo}`} alt={b.name} loading="lazy" />
                </a>
              </li>
            ))}
          </ul>
        </div>
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
