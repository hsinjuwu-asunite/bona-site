'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { NavItem } from '@/lib/data';
import QuoteBadge from '@/components/QuoteBadge';

function isActive(item: NavItem, path: string): boolean {
  if (item.href) {
    const base = item.href.split('?')[0];
    if (base === '/') return path === '/';
    if (path === base || path.startsWith(base + '/')) return true;
  }
  return !!item.children?.some((c) => isActive(c, path));
}

function NavLink({ item, className, onNavigate }: { item: NavItem; className?: string; onNavigate: () => void }) {
  if (!item.href) return <span className={className}>{item.label}</span>;
  // 帶查詢參數的連結（型錄分類）用整頁載入，確保篩選套用
  if (item.href.includes('?'))
    return (
      <a href={item.href} className={className} onClick={onNavigate}>
        {item.label}
      </a>
    );
  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

function SubMenu({ items, onNavigate }: { items: NavItem[]; onNavigate: () => void }) {
  return (
    <ul className="snav__sub">
      {items.map((c) => (
        <SubItem key={c.label} item={c} onNavigate={onNavigate} />
      ))}
    </ul>
  );
}

function SubItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const has = !!item.children?.length;
  return (
    <li className={'snav__subitem' + (has ? ' has-sub' : '') + (open ? ' is-open' : '')}>
      {has ? (
        <button type="button" className="snav__sublink" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {item.label}
        </button>
      ) : (
        <NavLink item={item} className="snav__sublink" onNavigate={onNavigate} />
      )}
      {has && <SubMenu items={item.children!} onNavigate={onNavigate} />}
    </li>
  );
}

function TopItem({ item, path, onNavigate }: { item: NavItem; path: string; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const has = !!item.children?.length;
  useEffect(() => setOpen(false), [path]);
  return (
    <li
      className={'snav__item' + (has ? ' has-sub' : '') + (open ? ' is-open' : '')}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLink item={item} className={'snav__link' + (isActive(item, path) ? ' is-active' : '')} onNavigate={onNavigate} />
      {has && (
        <>
          <button
            type="button"
            className="snav__toggle"
            aria-label={`展開${item.label}`}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          />
          <SubMenu items={item.children!} onNavigate={onNavigate} />
        </>
      )}
    </li>
  );
}

export default function Header({ nav, phone }: { nav: NavItem[]; phone: string }) {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [path]);
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className="sh">
      <div className="sh__util">
        <div className="wrap sh__util-in">
          <span>
            電話 <a href={`tel:${phone.replace(/-/g, '')}`}>{phone}</a>
          </span>
          <span className="sh__hours">週一至週五 9:00–18:00</span>
          <span className="sh__util-note">付款方式：銀行匯款</span>
        </div>
      </div>
      <div className="wrap sh__main">
        <Link href="/" className="sh__logo" aria-label="寶楠科技股份有限公司 首頁">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="寶楠科技股份有限公司 BONA FIDE TECHNOLOGY CO.,LTD." width={331} height={76} />
        </Link>
        <nav className={'snav' + (menuOpen ? ' is-open' : '')} aria-label="主選單">
          <ul className="snav__list">
            {nav.map((item) => (
              <TopItem key={item.label} item={item} path={path} onNavigate={close} />
            ))}
          </ul>
        </nav>
        <div className="sh__actions">
          <QuoteBadge />
          <button
            type="button"
            className={'sh__burger' + (menuOpen ? ' is-open' : '')}
            aria-label={menuOpen ? '關閉選單' : '開啟選單'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
