import Link from 'next/link';
import PageShell from '@/components/PageShell';

export default function NotFound() {
  return (
    <PageShell hero="/images/banner1.jpg" crumbs={[{ label: '首頁', href: '/' }, { label: '找不到頁面' }]}>
      <div className="container">
        <div className="main-content">
          <h3 className="title">找不到頁面</h3>
          <p>
            您要找的頁面不存在。<Link href="/">回到首頁</Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
