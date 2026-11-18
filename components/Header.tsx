'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { NavItem } from '@/lib/data';

const BREAKPOINT = 1001; // same as the original data-breakpoint

function useIsSmall() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const check = () => setSmall(window.innerWidth <= BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return small;
}

function isActive(item: NavItem, path: string): boolean {
  if (item.href) {
    if (item.href === '/') return path === '/';
    if (path === item.href || path.startsWith(item.href + '/')) return true;
  }
  return !!item.children?.some((c) => isActive(c, path));
}

function MenuItem({ item, small, path, onNavigate }: { item: NavItem; small: boolean; path: string; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasChildren = !!item.children?.length;

  useEffect(() => setOpen(false), [small, path]);

  const enter = () => {
    if (small || !hasChildren) return;
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const leave = () => {
    if (small || !hasChildren) return;
    timer.current = setTimeout(() => setOpen(false), 150);
  };

  const link = item.href ? (
    <Link href={item.href} className={isActive(item, path) ? 'active' : undefined} onClick={onNavigate}>
      {item.label}
    </Link>
  ) : (
    <a href="#" onClick={(e) => { e.preventDefault(); if (small) setOpen((o) => !o); }}>
      {item.label}
    </a>
  );

  return (
    <li className={hasChildren ? 'item-with-ul' : undefined} onMouseEnter={enter} onMouseLeave={leave}>
      {link}
      {hasChildren && (
        <>
          <ul className={open ? 'flexnav-show' : undefined} style={{ display: open ? 'block' : 'none' }}>
            {item.children!.map((c) => (
              <MenuItem key={c.label} item={c} small={small} path={path} onNavigate={onNavigate} />
            ))}
          </ul>
          <span className={'touch-button' + (open ? ' active' : '')} onClick={() => setOpen((o) => !o)}>
            <i className="navicon glyphicon glyphicon-menu-down" />
          </span>
        </>
      )}
    </li>
  );
}

export default function Header({ nav, address, phone, hours }: { nav: NavItem[]; address: string; phone: string; hours: string }) {
  const path = usePathname();
  const small = useIsSmall();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('scroll___hidden', mobileOpen);
  }, [mobileOpen]);
  useEffect(() => setMobileOpen(false), [path]);

  const close = () => setMobileOpen(false);

  return (
    <div className="header">
      <div className="header-top clearfix">
        <div className="container">
          <ul className="header-info">
            <li><span className="glyphicon glyphicon-map-marker" /> {address}</li>
            <li><span className="glyphicon glyphicon-time" /> {hours}</li>
            <li><span className="glyphicon glyphicon-earphone" /> {phone}</li>
          </ul>
          <div className="header-top-right">
            <ul className="header-language">
              <li><a href="#">Eng</a></li>
              <li><a href="#" className="active">繁中</a></li>
              <li><a href="#">日本語</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container clearfix">
        <div className="logo">
          <h1><Link href="/">寶楠科技股份有限公司</Link></h1>
        </div>
        <div className="header-nav clearfix">
          <div
            className={'menu-button c-hamburger c-hamburger--htx' + (mobileOpen ? ' active' : '')}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span>toggle menu</span>
          </div>
          <nav className={'flexnav__container clearfix' + (mobileOpen ? ' open' : '')}>
            <ul className="mobile-language">
              <li><a href="#">Eng</a></li>
              <li><a href="#" className="active">繁中</a></li>
              <li><a href="#">日本語</a></li>
            </ul>
            <ul
              className={['flexnav', 'with-js', 'opacity', small ? 'sm-screen' : 'lg-screen', mobileOpen ? 'flexnav-show' : '']
                .filter(Boolean)
                .join(' ')}
            >
              {nav.map((item) => (
                <MenuItem key={item.label} item={item} small={small} path={path} onNavigate={close} />
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
