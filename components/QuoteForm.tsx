'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { clearQuote, removeFromQuote, setQty, useQuote } from '@/lib/quote';

export default function QuoteForm() {
  const lines = useQuote();
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, items: lines.map((l) => ({ sku: l.sku, qty: l.qty })) }),
    }).catch(() => null);
    if (res?.ok) {
      setStatus('ok');
      clearQuote();
      form.reset();
    } else setStatus('error');
  }

  if (status === 'ok') {
    return (
      <div className="quote-done">
        <h4>已收到您的詢價 🙏</h4>
        <p>我們會盡快以 E-mail 回覆報價，一般 1～2 個工作天內。急件請直接來電 02-2362-9517。</p>
        <Link href="/products/parts" className="btn-quote btn-quote--primary">繼續瀏覽商品</Link>
      </div>
    );
  }

  return (
    <div className="quote">
      <div className="quote__list">
        {lines.length === 0 ? (
          <p className="quote__empty">
            詢價單目前是空的。<Link href="/products/parts">到產品型錄挑選商品 →</Link>
            <br />
            找不到型號？也可以直接在下方「需求說明」填寫品牌、型號與數量。
          </p>
        ) : (
          <table className="quote__table">
            <thead>
              <tr><th>商品</th><th>數量</th><th /></tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.sku}>
                  <td>
                    <Link href={`/products/parts/${l.slug}`}><b>{l.brand}</b> {l.model}</Link>
                    <div className="quote__name">{l.name}</div>
                  </td>
                  <td>
                    <div className="qty">
                      <button type="button" onClick={() => setQty(l.sku, l.qty - 1)} aria-label="減少">−</button>
                      <input type="number" min={1} max={9999} value={l.qty} onChange={(e) => setQty(l.sku, Number(e.target.value) || 1)} />
                      <button type="button" onClick={() => setQty(l.sku, l.qty + 1)} aria-label="增加">＋</button>
                    </div>
                  </td>
                  <td><button className="quote__remove" onClick={() => removeFromQuote(l.sku)} aria-label="移除">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {lines.length > 0 && <p className="quote__more"><Link href="/products/parts">＋ 繼續加入其他商品</Link></p>}
      </div>

      <form className="quote__form" onSubmit={onSubmit}>
        <h4>聯絡資料</h4>
        <input className="form-control" name="name" placeholder="姓名 *" required />
        <input className="form-control" name="company" placeholder="公司名稱 *" required />
        <input className="form-control" name="unit" placeholder="單位 / 部門" />
        <input className="form-control" name="email" type="email" placeholder="E-mail *" required />
        <input className="form-control" name="tel" placeholder="電話 *" required />
        <textarea className="form-control" name="note" rows={4} placeholder="需求說明（交期、用途、替代型號、其他型號與數量…）" required={lines.length === 0} />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
        <button className="btn-quote btn-quote--primary btn-quote--block" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? '送出中…' : `送出詢價${lines.length ? `（${lines.length} 項）` : ''}`}
        </button>
        {status === 'error' && <p className="quote__err">送出失敗，請稍後再試或直接來電 02-2362-9517。</p>}
        <p className="quote__privacy">送出後由寶楠科技業務人員回覆報價，您的資料僅用於本次詢價聯繫。</p>
      </form>
    </div>
  );
}
