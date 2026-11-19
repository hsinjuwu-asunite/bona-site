/* eslint-disable @next/next/no-img-element */

const ICONS: Record<string, string> = {
  'UPS與電力': '⚡',
  '感測與量測': '◎',
  '流體控制': '◇',
  '電控與線材': '⌁',
  '動力與傳動': '⚙',
  '風機與空調': '✣',
  '光源與光學': '☀',
  '其他': '▣',
};

/** 商品圖：有照片用照片，沒有就顯示品牌＋類別的佔位圖 */
export default function ProductThumb({ item, large }: { item: { image: string | null; brand: string; model: string; group: string; category: string }; large?: boolean }) {
  if (item.image) {
    return <img src={item.image} alt={`${item.brand} ${item.model}`} loading={large ? 'eager' : 'lazy'} className="pthumb pthumb--photo" referrerPolicy="no-referrer" />;
  }
  return (
    <div className={'pthumb pthumb--ph' + (large ? ' pthumb--large' : '')} aria-label={`${item.brand} ${item.model}`}>
      <span className="pthumb__icon">{ICONS[item.group] ?? '▣'}</span>
      <span className="pthumb__brand">{item.brand}</span>
      <span className="pthumb__cat">{item.category}</span>
    </div>
  );
}
