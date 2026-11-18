import PageShell from '@/components/PageShell';
import QuoteForm from '@/components/QuoteForm';

export const metadata = { title: '詢價單', robots: { index: false } };

export default function QuotePage() {
  return (
    <PageShell hero="/images/contact.jpg" crumbs={[{ label: '首頁', href: '/' }, { label: '產品型錄', href: '/products/parts' }, { label: '詢價單' }]}>
      <div className="container">
        <h3 className="title">詢價單</h3>
        <QuoteForm />
      </div>
    </PageShell>
  );
}
