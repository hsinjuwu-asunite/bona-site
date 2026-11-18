import { NextResponse } from 'next/server';
import { esc, isEmail, sendToCompany } from '@/lib/mail';

const FIELDS: Record<string, string> = {
  Name: '姓名',
  Email: 'E-mail',
  company: '公司名稱',
  tel: '公司電話',
  unit: '單位名稱',
  Subject: '主旨',
  Message: '內文',
};

/** 取代舊站的 contact_save.php */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, string> | null;
  if (!body) return NextResponse.json({ ok: false, error: 'bad request' }, { status: 400 });
  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  const data: Record<string, string> = {};
  for (const k of Object.keys(FIELDS)) {
    const v = String(body[k] ?? '').trim();
    if (!v) return NextResponse.json({ ok: false, error: `missing ${k}` }, { status: 400 });
    data[k] = v.slice(0, 5000);
  }
  if (!isEmail(data.Email)) return NextResponse.json({ ok: false, error: 'invalid email' }, { status: 400 });

  const rows = Object.entries(FIELDS)
    .map(([k, label]) => `<tr><th align="left" style="padding:4px 12px 4px 0;vertical-align:top">${label}</th><td style="white-space:pre-wrap">${esc(data[k])}</td></tr>`)
    .join('');
  const r = await sendToCompany({
    subject: `【官網詢問】${data.Subject} - ${data.company} ${data.Name}`,
    html: `<p>官網聯絡表單收到一筆新詢問：</p><table>${rows}</table>`,
    replyTo: data.Email,
    logData: data,
  });
  return NextResponse.json(r, { status: r.ok ? 200 : 502 });
}
