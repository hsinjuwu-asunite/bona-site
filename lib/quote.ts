'use client';

import { useEffect, useState } from 'react';

/** 詢價單：存在瀏覽器 localStorage，之後可直接升級成購物車 */
export type QuoteLine = { sku: string; slug: string; name: string; brand: string; model: string; qty: number };

const KEY = 'bona-quote-v1';
const EVENT = 'bona-quote-change';

export function readQuote(): QuoteLine[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function write(lines: QuoteLine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function addToQuote(line: Omit<QuoteLine, 'qty'>, qty = 1) {
  const lines = readQuote();
  const found = lines.find((l) => l.sku === line.sku);
  if (found) found.qty += qty;
  else lines.push({ ...line, qty });
  write(lines);
}

export function setQty(sku: string, qty: number) {
  write(readQuote().map((l) => (l.sku === sku ? { ...l, qty: Math.max(1, Math.min(9999, qty)) } : l)));
}

export function removeFromQuote(sku: string) {
  write(readQuote().filter((l) => l.sku !== sku));
}

export function clearQuote() {
  write([]);
}

export function useQuote() {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  useEffect(() => {
    const sync = () => setLines(readQuote());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return lines;
}
