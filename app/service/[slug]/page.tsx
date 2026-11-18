import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import { serviceArticles } from '@/lib/data';

export function generateStaticParams() {
  return serviceArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = serviceArticles.find((x) => x.slug === slug);
  if (!a) return {};
  const text = a.html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  return { title: a.title, description: text.slice(0, 120) || a.title };
}

export default async function ServiceArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = serviceArticles.find((x) => x.slug === slug);
  if (!a) notFound();
  return (
    <PageShell
      hero={a.hero ?? '/images/ups.jpg'}
      crumbs={[{ label: '首頁', href: '/' }, { label: 'UPS售後服務與維修保養' }, { label: a.title }]}
    >
      <div className="container">
        <div className="main-content">
          <div className="article">
            <h3>{a.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: a.html }} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
