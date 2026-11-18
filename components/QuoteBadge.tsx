'use client';

import Link from 'next/link';
import { useQuote } from '@/lib/quote';

export default function QuoteBadge({ className }: { className?: string }) {
  const lines = useQuote();
  return (
    <Link href="/quote" className={'quote-badge ' + (className ?? '')}>
      詢價單{lines.length > 0 && <span className="quote-badge__n">{lines.length}</span>}
    </Link>
  );
}
