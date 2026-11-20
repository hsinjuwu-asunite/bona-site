import Link from 'next/link';
import { site } from '@/lib/data';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="sf">
      <div className="wrap sf__grid">
        <div className="sf__co">
          <p className="sf__name">{site.name}</p>
          <p className="sf__en">{site.name_en}</p>
          <p className="sf__since">1997 年成立。代理工業級大型不斷電系統，並為台灣的面板、半導體廠代購日本設備零組件。</p>
        </div>
        <dl className="sf__contact">
          <dt>台北總公司</dt>
          <dd>
            {site.postal_code} {site.address}
          </dd>
          <dt>台中辦事處</dt>
          <dd>{site.taichung_office.note}，2004 年設立</dd>
          <dt>電話／傳真</dt>
          <dd>
            <a href={`tel:${site.phone.replace(/-/g, '')}`}>{site.phone}</a>
            <span className="sf__sep">／</span>
            {site.fax.replace('+886-', '0')}
          </dd>
          <dt>營業時間</dt>
          <dd>週一至週五 9:00–18:00</dd>
        </dl>
        <ul className="sf__links">
          <li><Link href="/products/parts">產品型錄</Link></li>
          <li><Link href="/products/ups/what-is-ups">UPS 不斷電系統</Link></li>
          <li><Link href="/products/japan-brands">日本廠牌一覽</Link></li>
          <li><Link href="/quote">詢價單</Link></li>
          <li><Link href="/about">公司簡介</Link></li>
          <li><Link href="/contact">聯絡我們</Link></li>
        </ul>
      </div>
      <div className="wrap">
        <p className="sf__legal">© 1997–{year} {site.name}　版權所有</p>
      </div>
    </footer>
  );
}
