import Link from 'next/link';
import type { ReactNode } from 'react';

export type Crumb = { label: string; href?: string };

export default function PageShell({ hero, crumbs, children }: { hero: string; crumbs: Crumb[]; children: ReactNode }) {
  return (
    <>
      <div className="hero-container">
        <div className="hero-slick">
          <div className="slick-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero} alt="" />
          </div>
        </div>
      </div>
      <div className="services-breadcrumb">
        <div className="container">
          <div className="inner_breadcrumb">
            <ul className="short">
              {crumbs.map((c, i) => (
                <li key={i}>
                  {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
                  {i < crumbs.length - 1 && <span>|</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="site-content">{children}</div>
    </>
  );
}
