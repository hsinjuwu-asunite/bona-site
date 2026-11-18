import PageShell from '@/components/PageShell';
import { pages } from '@/lib/data';

export const metadata = {
  title: '公司簡介',
  description: '寶楠科技成立於1997年，銷售工業級大型不斷電系統 UPS 與日本機台設備零組件，客戶包括友達、群創、華映等面板廠與日系企業。',
};

export default function About() {
  return (
    <PageShell hero={pages.about.hero} crumbs={[{ label: '首頁', href: '/' }, { label: '公司簡介' }]}>
      <div className="container">
        <h3 className="title">公司簡介</h3>
        <div className="about">
          <div className="about__inner" dangerouslySetInnerHTML={{ __html: pages.about.html }} />
        </div>
      </div>
    </PageShell>
  );
}
