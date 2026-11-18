export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/**
 * 透過 Resend 寄信給公司。需要 RESEND_API_KEY、CONTACT_TO、CONTACT_FROM。
 * 還沒設定時回傳 { delivered: false }，內容只記在 Cloudflare Logs。
 */
export async function sendToCompany(opts: { subject: string; html: string; replyTo: string; logData: unknown }) {
  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO) {
    console.warn('[mail] not configured, data:', JSON.stringify(opts.logData));
    return { ok: true, delivered: false };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: CONTACT_FROM || '寶楠科技官網 <onboarding@resend.dev>',
      to: CONTACT_TO.split(',').map((s) => s.trim()).filter(Boolean),
      reply_to: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
    }),
  });
  if (!res.ok) {
    console.error('[mail] resend error', res.status, await res.text(), JSON.stringify(opts.logData));
    return { ok: false, delivered: false };
  }
  return { ok: true, delivered: true };
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
