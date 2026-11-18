"""Build public catalog.json for the website from the 寶楠 產品型錄 Sheet export.

Only public fields are written. Internal columns (進價, 毛利率, 進貨渠道, 主要客戶, 價格備註) are dropped.
Usage: python3 -I build_catalog.py <raw_dir> <old_products.json> <out.json>
"""
import json, glob, re, sys, datetime, collections

RAW, OLD, OUT = sys.argv[1:4]
TODAY = datetime.date(2026, 11, 18)
PRICE_MAX_AGE_DAYS = 365 * 3  # 超過 3 年的成交價不顯示，改為「請詢價」


def load(f):
    j = json.loads(open(f, encoding='utf-8').read())
    if isinstance(j, list):
        j = json.loads(j[0]['text'])
    return j['value']


rows = {}
for f in glob.glob(f'{RAW}/toolu_*.json'):
    for k, r in load(f)['rows'].items():
        rows.setdefault(int(k), {})['AG'] = r
for k, r in load(glob.glob(f'{RAW}/mcp-*.txt')[0])['rows'].items():
    rows.setdefault(int(k), {})['JV'] = r


def num(c):
    if isinstance(c, dict):
        return c.get('number')
    if isinstance(c, (int, float)):
        return c
    return None


def date(c):
    return c.get('date') if isinstance(c, dict) else None


def text(c):
    if c is None:
        return ''
    s = str(c).strip()
    return '' if s.lower() in ('nan', 'none', 'n/a') else s


BAD_LEAD = re.compile(r"^'|詳備註|確認中|未定|疫情")


def lead(c):
    s = re.sub(r'\s+', ' ', text(c)).strip(' ,')
    if not s or BAD_LEAD.search(s) or re.fullmatch(r"[\d.\- :']+", s):
        return None
    s = s.replace('~', '～').replace('1m', '1個月')
    return s


def norm(s):
    return re.sub(r'[^A-Z0-9]', '', s.upper())


# old-site images and datasheets, matched by brand+model
old = json.load(open(OLD, encoding='utf-8'))
old_by_key = {}
for p in old:
    k = (norm(p['brand']), norm(p['model']))
    old_by_key.setdefault(k, p)
old_by_model = collections.defaultdict(list)
for p in old:
    old_by_model[norm(p['model'])].append(p)

items, used = [], set()
for rn in sorted(rows):
    ag, jv = rows[rn]['AG'], rows[rn]['JV']
    sku, group, cat, brand, model, name = [text(x) for x in ag[:6]]
    price = num(ag[6])
    price_date = date(jv[4])
    spec = text(jv[10])
    grade = text(jv[11])[:1] or 'C'
    deals = int(num(jv[12]) or 0)

    show_price = None
    if price and price_date:
        d = datetime.date.fromisoformat(price_date)
        if d <= TODAY and (TODAY - d).days <= PRICE_MAX_AGE_DAYS:
            show_price = round(price)

    slug = sku.lower()
    n = 2
    while slug in used:
        slug = f'{sku.lower()}-{n}'; n += 1
    used.add(slug)

    o = old_by_key.get((norm(brand), norm(model)))
    if not o:
        cands = old_by_model.get(norm(model), [])
        o = cands[0] if len(cands) == 1 and len(norm(model)) >= 5 else None

    items.append({
        'sku': sku, 'slug': slug, 'group': group, 'category': cat,
        'brand': brand, 'model': model, 'name': name,
        'price': show_price, 'price_date': price_date if show_price else None,
        'lead_time': lead(jv[0]),
        'spec': spec,
        'grade': grade, 'popularity': deals,
        'image': (o or {}).get('image'),
        'datasheets': (o or {}).get('spec_links', []),
    })

json.dump(items, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('items', len(items))
print('with price', sum(1 for i in items if i['price']))
print('with lead', sum(1 for i in items if i['lead_time']))
print('with image', sum(1 for i in items if i['image']))
print('with datasheet', sum(1 for i in items if i['datasheets']))
print('with spec', sum(1 for i in items if i['spec']))
