import PageShell from '@/components/PageShell';
import ContactForm from '@/components/ContactForm';
import { pages } from '@/lib/data';

export const metadata = {
  title: '聯絡我們',
  description: '寶楠科技股份有限公司 聯絡方式：台北市大安區新生南路3段6號2樓，電話 02-2362-9517。UPS 與日本零組件詢價請填寫表單。',
};

export default async function Contact({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject } = await searchParams;
  const c = pages.contact;
  return (
    <PageShell hero={c.hero} crumbs={[{ label: '首頁', href: '/' }, { label: '聯絡我們' }]}>
      <div className="contact-form">
        <div className="container">
          <h3 className="title">聯絡我們</h3>
          <div className="inner_sec_info_wthree_agile">
            <ContactForm defaultSubject={subject} />
          </div>
        </div>
      </div>
      <div className="contact-info clearfix">
        <div className="contact-info__map">
          <iframe src={c.map_iframe} style={{ border: 0 }} allowFullScreen loading="lazy" title="map" />
        </div>
        <div className="container">
          <div className="contact-info__content">
            <div className="contact-info__inner" dangerouslySetInnerHTML={{ __html: c.info_html }} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
