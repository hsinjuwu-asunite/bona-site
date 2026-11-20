'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';

type ThumbItem = { image: string | null; brand: string; model: string; group: string; category: string };

/**
 * 商品圖：有照片用照片；沒有照片、或外部圖片載入失敗（被擋外連、已下架）時，
 * 改顯示「品牌＋型號」的銘牌樣式佔位圖。
 */
export default function ProductThumb({ item, large }: { item: ThumbItem; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // 伺服器端輸出的 <img> 可能在 React 接手前就已載入失敗，onError 不會再觸發，掛載時補檢查一次
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (item.image && !failed) {
    return (
      <img
        ref={ref}
        src={item.image}
        alt={`${item.brand} ${item.model}`}
        loading={large ? 'eager' : 'lazy'}
        className="pthumb pthumb--photo"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div className={'pthumb pthumb--ph' + (large ? ' pthumb--large' : '')} role="img" aria-label={`${item.brand} ${item.model}`}>
      <span className="pthumb__brand">{item.brand}</span>
      <span className="pthumb__model">{item.model}</span>
      <span className="pthumb__cat">{item.category}</span>
    </div>
  );
}
