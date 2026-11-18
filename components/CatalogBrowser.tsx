'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { GroupInfo, ListItem } from '@/lib/catalog';
import ProductThumb from '@/components/ProductThumb';
import AddToQuote from '@/components/AddToQuote';

const PAGE_SIZE = 24;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
type Sort = 'popular' | 'price-asc' | 'price-desc' | 'model';

type State = { g: string; c: string; b: string; q: string; letter: string; sort: Sort; priced: boolean; page: number };
const EMPTY: State = { g: '', c: '', b: '', q: '', letter: '', sort: 'popular', priced: false, page: 1 };

function readUrl(): State {
  const p = new URLSearchParams(window.location.search);
  return {
    g: p.get('g') ?? '',
    c: p.get('c') ?? '',
    b: p.get('b') ?? '',
    q: p.get('q') ?? '',
    letter: (p.get('letter') ?? '').toUpperCase(),
    sort: (p.get('sort') as Sort) || 'popular',
    priced: p.get('priced') === '1',
    page: Math.max(1, Number(p.get('page')) || 1),
  };
}

function writeUrl(s: State) {
  const p = new URLSearchParams();
  if (s.g) p.set('g', s.g);
  if (s.c) p.set('c', s.c);
  if (s.b) p.set('b', s.b);
  if (s.q) p.set('q', s.q);
  if (s.letter) p.set('letter', s.letter);
  if (s.sort !== 'popular') p.set('sort', s.sort);
  if (s.priced) p.set('priced', '1');
  if (s.page > 1) p.set('page', String(s.page));
  const qs = p.toString();
  window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
}

const norm = (s: string) => s.toLowerCase().replace(/[\s\-_/.()]/g, '');

export default function CatalogBrowser({ items, groups, brands }: { items: ListItem[]; groups: GroupInfo[]; brands: { brand: string; count: number }[] }) {
  const [s, setS] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setS(readUrl());
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) writeUrl(s);
  }, [s, ready]);

  const update = (patch: Partial<State>) => {
    setS((prev) => ({ ...prev, page: 1, ...patch }));
    setFiltersOpen(false);
  };

  const filtered = useMemo(() => {
    const q = norm(s.q);
    let list = items.filter(
      (i) =>
        (!s.g || i.group === s.g) &&
        (!s.c || i.category === s.c) &&
        (!s.b || i.brand === s.b) &&
        (!s.letter || i.brand.toUpperCase().startsWith(s.letter)) &&
        (!s.priced || i.price != null) &&
        (!q || norm(`${i.brand} ${i.model} ${i.name} ${i.sku} ${i.category}`).includes(q)),
    );
    list = [...list].sort((a, b) => {
      if (s.sort === 'price-asc') return (a.price ?? Infinity) - (b.price ?? Infinity);
      if (s.sort === 'price-desc') return (b.price ?? -1) - (a.price ?? -1);
      if (s.sort === 'model') return a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model);
      return b.popularity - a.popularity || a.brand.localeCompare(b.brand);
    });
    return list;
  }, [items, s]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(s.page, totalPages);
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeGroup = groups.find((g) => g.group === s.g);
  const hasFilter = s.g || s.c || s.b || s.q || s.letter || s.priced;

  const goPage = (n: number) => {
    setS((prev) => ({ ...prev, page: n }));
    document.getElementById('catalog-top')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="catalog" id="catalog-top">
      <aside className={'catalog-side' + (filtersOpen ? ' open' : '')}>
        <div className="catalog-side__title">商品分類</div>
        <ul className="catalog-cats">
          <li>
            <button className={!s.g ? 'active' : ''} onClick={() => update({ g: '', c: '' })}>
              全部商品 <span>{items.length}</span>
            </button>
          </li>
          {groups.map((g) => (
            <li key={g.group}>
              <button className={s.g === g.group && !s.c ? 'active' : ''} onClick={() => update({ g: g.group, c: '' })}>
                {g.group} <span>{g.count}</span>
              </button>
              {s.g === g.group && (
                <ul>
                  {g.categories.map((c) => (
                    <li key={c.category}>
                      <button className={s.c === c.category ? 'active' : ''} onClick={() => update({ g: g.group, c: c.category })}>
                        {c.category} <span>{c.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="catalog-side__title">品牌</div>
        <select className="form-control" value={s.b} onChange={(e) => update({ b: e.target.value, letter: '' })}>
          <option value="">全部品牌（{brands.length}）</option>
          {brands.map((b) => (
            <option key={b.brand} value={b.brand}>
              {b.brand}（{b.count}）
            </option>
          ))}
        </select>
        <label className="catalog-check">
          <input type="checkbox" checked={s.priced} onChange={(e) => update({ priced: e.target.checked })} /> 只顯示有參考價的商品
        </label>
      </aside>

      <div className="catalog-main">
        <div className="catalog-toolbar">
          <input
            className="form-control catalog-search"
            type="search"
            placeholder="搜尋型號、品牌、品名…"
            value={s.q}
            onChange={(e) => update({ q: e.target.value })}
          />
          <select className="form-control catalog-sort" value={s.sort} onChange={(e) => update({ sort: e.target.value as Sort })}>
            <option value="popular">熱門優先</option>
            <option value="model">品牌 / 型號</option>
            <option value="price-asc">價格低 → 高</option>
            <option value="price-desc">價格高 → 低</option>
          </select>
          <button className="btn btn-default catalog-filter-btn" onClick={() => setFiltersOpen((o) => !o)}>
            篩選
          </button>
        </div>

        <ul className="name-filter catalog-letters">
          {LETTERS.map((l) => (
            <li key={l}>
              <a
                href="#"
                className={s.letter === l ? 'active' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  update({ letter: s.letter === l ? '' : l, b: '' });
                }}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div className="catalog-summary">
          {activeGroup ? (
            <>
              {activeGroup.group}
              {s.c && <> › {s.c}</>}
              {' · '}
            </>
          ) : null}
          共 <b>{filtered.length}</b> 項商品
          {hasFilter && (
            <button className="catalog-clear" onClick={() => update({ ...EMPTY })}>
              清除篩選
            </button>
          )}
        </div>

        <div className="catalog-grid">
          {shown.map((i) => (
            <div key={i.sku} className="pcard">
              <Link href={`/products/parts/${i.slug}`} className="pcard__img">
                <ProductThumb item={i} />
                {i.grade === 'A' && <span className="badge-hot">熱銷</span>}
              </Link>
              <div className="pcard__body">
                <div className="pcard__brand">{i.brand}</div>
                <Link href={`/products/parts/${i.slug}`} className="pcard__model">
                  {i.model}
                </Link>
                <div className="pcard__name">{i.name}</div>
                <div className="pcard__meta">
                  <span className="pcard__price">{i.price != null ? <>NT$ {i.price.toLocaleString('en-US')}</> : '請詢價'}</span>
                  {i.lead_time && <span className="pcard__lead">交期 {i.lead_time}</span>}
                </div>
                <AddToQuote item={i} compact />
              </div>
            </div>
          ))}
          {ready && shown.length === 0 && <p className="catalog-empty">沒有符合條件的商品。找不到需要的型號？歡迎直接詢價，我們可代為向日本原廠詢價。</p>}
        </div>

        {totalPages > 1 && (
          <nav className="pagination-warp">
            <ul className="pagination">
              <li className="page-control">{page > 1 && <a href="#" onClick={(e) => { e.preventDefault(); goPage(page - 1); }}>上一頁</a>}</li>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                .map((n, idx, arr) => (
                  <li key={n} className="page-numbers">
                    {idx > 0 && n - arr[idx - 1] > 1 && <span className="page-gap">…</span>}
                    <a href="#" className={n === page ? undefined : 'active'} onClick={(e) => { e.preventDefault(); goPage(n); }}>
                      {n}
                    </a>
                  </li>
                ))}
              <li className="page-total"><span>{page}/{totalPages}</span></li>
              <li className="page-control">{page < totalPages && <a href="#" onClick={(e) => { e.preventDefault(); goPage(page + 1); }}>下一頁</a>}</li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
