'use client';

import { useState, type FormEvent } from 'react';

const fields = [
  { name: 'Name', type: 'text', placeholder: '姓名', half: true },
  { name: 'Email', type: 'email', placeholder: 'e-mail', half: true },
  { name: 'company', type: 'text', placeholder: '公司名稱' },
  { name: 'tel', type: 'text', placeholder: '公司電話' },
  { name: 'unit', type: 'text', placeholder: '單位名稱' },
  { name: 'Subject', type: 'text', placeholder: '主旨' },
];

export default function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setStatus(res.ok ? 'ok' : 'error');
    if (res.ok) e.currentTarget.reset();
  }

  const half = fields.filter((f) => f.half);
  const full = fields.filter((f) => !f.half);

  return (
    <form onSubmit={onSubmit}>
      <div className="row col-2">
        {half.map((f) => (
          <div key={f.name} className="input input--chisato col-md-6">
            <input className="input__field input__field--chisato" name={f.name} placeholder={f.placeholder} required type={f.type} />
          </div>
        ))}
      </div>
      {full.map((f) => (
        <div key={f.name} className="row">
          <div className="input input--chisato col-md-12">
            <input className="input__field input__field--chisato" name={f.name} placeholder={f.placeholder} required type={f.type} defaultValue={f.name === 'Subject' ? defaultSubject : undefined} />
          </div>
        </div>
      ))}
      <div className="row">
        <div className="input col-md-12">
          <textarea name="Message" placeholder="內文" required />
        </div>
      </div>
      {/* honeypot：防垃圾訊息，真人看不到 */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
      <div className="btn-row">
        <input value={status === 'sending' ? '送出中…' : '送出'} type="submit" disabled={status === 'sending'} />
      </div>
      {status === 'ok' && <p style={{ textAlign: 'center', color: '#0d42ff' }}>已收到您的訊息，我們將盡快與您聯繫。</p>}
      {status === 'error' && <p style={{ textAlign: 'center', color: 'red' }}>送出失敗，請稍後再試或直接來電。</p>}
    </form>
  );
}
