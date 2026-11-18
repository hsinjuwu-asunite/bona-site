import { NextResponse } from 'next/server';

const FIELDS: Record<string, string> = {
  Name: '姓名',
  Email: 'E-mail',
  company: '公司名稱',
  tel: '公司電話',
  unit: '單位名稱',
  Subject: '主旨',
  Message: '內文',
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/**
 * 取代舊站的 contact_save.php：收到詢問後用 Resend 寄信給公司。
 * 需要的環境變數：RESEND_API_KEY（機密）、CONTACT_TO、CONTACT_FROM。
 * 之後要接 AI 詢價報價流程或存進資料庫（Cloudflare D1），從這裡加。
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, string> | null;
  if (!body) return NextResponse.json({ ok: false, error: 'bad request' }, { status: 400 });

  // 防垃圾訊息：真人看不到這個欄位，機器人會填
  if (body.website) return NextResponse.json({ ok: true });

  const data: Record<string, string> = {};
  for (const k of Object.keys(FIELDS)) {
    const v = String(body[k] ?? '').trim();
    if (!v) return NextResponse.json({ ok: false, error: `missing ${k}` }, { status: 400 });
    data[k] = v.slice(0, 5000);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
    return NextResponse.json({ ok: false, error: 'invalid email' }, { status: 400 });
  }

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO) {
    // 還沒設定寄信時，至少把內容留在 Cloudflare 的 Logs 裡
    console.warn('[contact] email not configured, inquiry:', JSON.stringify(data));
    return NextResponse.json({ ok: true, delivered: false });
  }

  const rows = Object.entries(FIELDS)
    .map(([k, label]) => `<tr><th align="left" style="padding:4px 12px 4px 0;vertical-align:top">${label}</th><td style="white-space:pre-wrap">${esc(data[k])}</td></tr>`)
    .join('');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: CONTACT_FROM || '寶楠科技官網 <onboarding@resend.dev>',
      to: CONTACT_TO.split(',').map((s) => s.trim()).filter(Boolean),
      reply_to: data.Email,
      subject: `【官網詢問】${data.Subject} - ${data.company} ${data.Name}`,
      html: `<p>官網聯絡表單收到一筆新詢問：</p><table>${rows}</table>`,
    }),
  });

  if (!res.ok) {
    console.error('[contact] resend error', res.status, await res.text(), JSON.stringify(data));
    return NextResponse.json({ ok: false, error: 'send failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
