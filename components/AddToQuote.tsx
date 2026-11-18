'use client';

import Link from 'next/link';
import { useState } from 'react';
import { addToQuote, useQuote } from '@/lib/quote';

type Item = { sku: string; slug: string; name: string; brand: string; model: string };

export default function AddToQuote({ item, compact }: { item: Item; compact?: boolean }) {
  const lines = useQuote();
  const inQuote = lines.find((l) => l.sku === item.sku);
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState(false);

  const add = () => {
    addToQuote({ sku: item.sku, slug: item.slug, name: item.name, brand: item.brand, model: item.model }, compact ? 1 : qty);
    setFlash(true);
    setTimeout(() => setFlash(false), 1500);
  };

  if (compact) {
    return (
      <button className={'btn-quote btn-quote--sm' + (inQuote ? ' is-added' : '')} onClick={add}>
        {flash ? '✓ 已加入' : inQuote ? `詢價單中（${inQuote.qty}）＋1` : '＋ 加入詢價單'}
      </button>
    );
  }

  return (
    <div className="quote-box">
      <div className="quote-box__row">
        <label htmlFor="qty">數量</label>
        <div className="qty">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="減少">−</button>
          <input id="qty" type="number" min={1} max={9999} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(9999, Number(e.target.value) || 1)))} />
          <button type="button" onClick={() => setQty((q) => Math.min(9999, q + 1))} aria-label="增加">＋</button>
        </div>
      </div>
      <div className="quote-box__btns">
        <button className="btn-quote" onClick={add}>
          {flash ? '✓ 已加入詢價單' : '＋ 加入詢價單'}
        </button>
        <Link
          className="btn-quote btn-quote--primary"
          href="/quote"
          onClick={() => {
            if (!inQuote) addToQuote({ sku: item.sku, slug: item.slug, name: item.name, brand: item.brand, model: item.model }, qty);
          }}
        >
          立即詢價
        </Link>
      </div>
      {inQuote && (
        <p className="quote-box__note">
          詢價單中已有 {inQuote.qty} 件，<Link href="/quote">前往詢價單 →</Link>
        </p>
      )}
    </div>
  );
}
