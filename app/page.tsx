import PageShell from '@/components/PageShell';
import { pages } from '@/lib/data';

export default function Home() {
  return (
    <PageShell hero={pages.home.banner} crumbs={[{ label: '首頁' }]}>
      <div className="container">
        <div className="main-content">
          <div className="intro" dangerouslySetInnerHTML={{ __html: pages.home.intro_html }} />
        </div>
      </div>
    </PageShell>
  );
}
