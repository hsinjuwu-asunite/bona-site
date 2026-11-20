import Link from 'next/link';
import type { ReactNode } from 'react';

export type Crumb = { label: string; href?: string };

/**
 * 內頁外框：麵包屑列＋內容。
 * 舊站每頁的橫幅圖（hero）上燒有英文字，新版不再顯示；參數保留以免各頁都要改。
 */
export default function PageShell({ crumbs, children }: { hero?: string; crumbs: Crumb[]; children: ReactNode }) {
  return (
    <>
      <nav className="crumbs" aria-label="目前位置">
        <ol className="wrap">
          {crumbs.map((c, i) => (
            <li key={i} aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
              {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
            </li>
          ))}
        </ol>
      </nav>
      <div className="site-content">{children}</div>
    </>
  );
}
