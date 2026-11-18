import { NextResponse } from 'next/server';
import { catalog, formatPrice } from '@/lib/catalog';
import { esc, isEmail, sendToCompany } from '@/lib/mail';

type Line = { sku: string; qty: number };

/** 詢價單送出：寄給公司，含每個品項的型號、數量、參考價、交期 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false, error: 'bad request' }, { status: 400 });
  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  const str = (k: string, max = 500) => String(body[k] ?? '').trim().slice(0, max);
  const c = { name: str('name'), company: str('company'), email: str('email'), tel: str('tel'), unit: str('unit'), note: str('note', 5000) };
  if (!c.name || !c.company || !c.email || !c.tel) return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
  if (!isEmail(c.email)) return NextResponse.json({ ok: false, error: 'invalid email' }, { status: 400 });

  const raw = Array.isArray(body.items) ? (body.items as Line[]).slice(0, 100) : [];
  const lines = raw
    .map((l) => ({ item: catalog.find((i) => i.sku === String(l.sku)), qty: Math.max(1, Math.min(9999, Math.floor(Number(l.qty) || 1))) }))
    .filter((l) => l.item);
  if (lines.length === 0 && !c.note) return NextResponse.json({ ok: false, error: 'empty' }, { status: 400 });

  const td = 'style="border:1px solid #ccc;padding:4px 8px"';
  const itemRows = lines
    .map(({ item, qty }) =>
      `<tr><td ${td}>${esc(item!.sku)}</td><td ${td}>${esc(item!.brand)}</td><td ${td}>${esc(item!.model)}</td><td ${td}>${esc(item!.name)}</td><td ${td} align="right">${qty}</td><td ${td} align="right">${item!.price != null ? formatPrice(item!.price) : '—'}</td><td ${td}>${esc(item!.lead_time ?? '—')}</td></tr>`)
    .join('');
  const info = [
    ['姓名', c.name], ['公司', c.company], ['單位', c.unit], ['E-mail', c.email], ['電話', c.tel], ['備註', c.note],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><th align="left" style="padding:4px 12px 4px 0;vertical-align:top">${k}</th><td style="white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('');

  const html = `<p>官網收到一筆新的詢價單（${lines.length} 項）：</p>
<table style="border-collapse:collapse">${info}</table>
${lines.length ? `<h3>詢價品項</h3><table style="border-collapse:collapse"><tr><th ${td}>商品編號</th><th ${td}>品牌</th><th ${td}>型號</th><th ${td}>品名</th><th ${td}>數量</th><th ${td}>網站參考價</th><th ${td}>參考交期</th></tr>${itemRows}</table>` : ''}`;

  const first = lines[0]?.item;
  const r = await sendToCompany({
    subject: `【官網詢價】${c.company} ${c.name}${first ? `｜${first.brand} ${first.model}${lines.length > 1 ? ` 等 ${lines.length} 項` : ''}` : ''}`,
    html,
    replyTo: c.email,
    logData: { ...c, items: lines.map((l) => ({ sku: l.item!.sku, qty: l.qty })) },
  });
  return NextResponse.json(r, { status: r.ok ? 200 : 502 });
}
