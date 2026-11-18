import { NextResponse, type NextRequest } from 'next/server';
import articles from '@/data/articles.json';

/** 301-redirect every old PHP URL to its new clean URL (keeps Google rankings & old bookmarks). */
const INFO: Record<string, string> = Object.fromEntries(
  articles.filter((a) => typeof a.id === 'number').map((a) => [String(a.id), `/products/ups/${a.slug}`]),
);
const CLASS: Record<string, string> = {
  '3': '/products/ups/what-is-ups',
  '4': '/products/ups/twu-single-phase',
  '5': '/products/ups/ups-single-line-diagram',
  '6': '/products/ups/ups-sales-record',
};

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const go = (to: string) => NextResponse.redirect(new URL(to, req.url), 301);

  switch (pathname) {
    case '/index.php':
      return go('/');
    case '/about.php':
      return go('/about');
    case '/contact.php':
      return go('/contact');
    case '/products_catelog.php':
      return go('/products');
    case '/products_japan.php':
      return go('/products/japan-brands');
    case '/products_content.php': {
      const info = searchParams.get('info_id');
      const cls = searchParams.get('class_item_id');
      return go((info && INFO[info]) || (cls && CLASS[cls]) || '/products');
    }
    case '/ups.php': {
      const cls = searchParams.get('class_item_id');
      return go(cls === '10' ? '/service/ups-inspection' : '/service/ups-maintenance');
    }
    case '/products_sale.php': {
      const l = searchParams.get('srh_txt');
      return go('/products/parts' + (l ? `?letter=${encodeURIComponent(l)}` : ''));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/:file(.*\\.php)'] };
