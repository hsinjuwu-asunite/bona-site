"""把網店 Product Master（只含公開欄位的 products_public.json）合併進 data/catalog.json。

- 售價：最近成交價 × 1.08，進位到 10 元；仍沿用「近 3 年內有成交才顯示」的規則（catalog.json 的 price_date）。
- 圖片：舊官網已有照片的優先；沒有的改用 Product Master 從網路找到的原廠／通路圖片網址。
- 規格書：沒有規格書的補上 Product Master 的原廠資料連結。
- 說明：新增 description 欄位（不含連結那一行）。
- 規格：只保留電壓、頻率、容量、尺寸、材質等技術規格，濾掉客戶廠區、內部料號等字樣。
Usage: python3 -I scripts/merge_product_master.py <products_public.json> data/catalog.json
"""
import json, math, re, sys

MASTER, CATALOG = sys.argv[1:3]
MARKUP = 1.08
m = {x['sku']: x for x in json.load(open(MASTER, encoding='utf-8'))}
cat = json.load(open(CATALOG, encoding='utf-8'))

UNIT = re.compile(r'^[\d.~\-/×*+ ]+\s*(V|VAC|VDC|HZ|KVA|VA|W|KW|A|MA|MM|CM|M|SLM|L/MIN|KPA|MPA|PA|RPM|°C|℃|KG|G|N|DBA|IN|")$'
                  r'|^(SUS\d+|PFA|PTFE|NBR|FKM|EPDM|PVDF|PP|PVC|NPN|PNP)$', re.I)


def clean_spec(s):
    out = []
    for t in re.split(r'[,，]', s or ''):
        t = t.strip()
        if t and UNIT.match(t) and t.upper() not in (x.upper() for x in out):
            out.append(t)
    return ', '.join(out[:8])


n_img = n_ds = n_desc = 0
for i in cat:
    p = m.get(i['sku'])
    if i.get('price') is not None:
        i['price'] = math.ceil(i['price'] * MARKUP / 10) * 10
    i['spec'] = clean_spec(i.get('spec', ''))
    if not p:
        i.setdefault('description', '')
        continue
    if not i.get('lead_time') and p.get('lead_time'):
        i['lead_time'] = p['lead_time']
    if not i.get('image') and p.get('image'):
        i['image'] = p['image']; n_img += 1
    if not i.get('datasheets') and p.get('spec_url'):
        i['datasheets'] = [{'text': '規格書／原廠資料', 'href': p['spec_url']}]; n_ds += 1
    d = re.sub(r'\n?規格書／原廠資料：.*$', '', p.get('description') or '', flags=re.S).strip()
    i['description'] = d
    n_desc += bool(d)

json.dump(cat, open(CATALOG, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('items', len(cat), 'added images', n_img, 'added datasheets', n_ds, 'descriptions', n_desc,
      'with price', sum(1 for i in cat if i['price'] is not None))
