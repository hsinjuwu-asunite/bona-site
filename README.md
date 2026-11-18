# 寶楠科技 新官網（Next.js）

## 在本機執行

需要先安裝 Node.js 20 以上的版本。

```bash
npm install
npm run dev          # 開發模式，打開 http://localhost:3000
# 正式環境
npm run build && npm start
```

## 網址對照（舊網址會自動 301 轉到新網址）

| 新網址 | 舊網址 |
|---|---|
| `/` | index.php |
| `/about` | about.php |
| `/contact` | contact.php |
| `/products` | products_catelog.php |
| `/products/ups/[slug]` | products_content.php?info_id=6–14 和 ?class_item_id=3–6 |
| `/service/ups-maintenance`、`/service/ups-inspection` | ups.php?class_item_id=9、10 |
| `/products/japan-brands` | products_japan.php |
| `/products/parts?letter=K&page=2` | products_sale.php?srh_txt=K&nowpage=2 |
| `/products/parts/[slug]` | **新增**：每個零件各自一頁，頁面上有「詢價」按鈕 |

轉址的規則寫在 `middleware.ts`。新站上線後，Google 收錄的舊網址和客戶存的書籤都會自動導到新頁面。

## 專案結構

```
app/                 頁面（App Router）
  api/contact/       聯絡表單 API，取代舊的 contact_save.php
components/          Header（選單）、PageShell（橫幅＋麵包屑）、ProductCard、ContactForm
lib/data.ts          資料讀取、型別和選單結構
data/*.json          網站所有內容，從舊站抓出來的
public/              舊站的 CSS、圖片、PDF，路徑和舊站一樣
public/css/site.css  新站另外加的樣式
```

- 外觀直接沿用舊站的 CSS（bootstrap、flexnav、style），所以看起來和舊站一樣。舊站靠 jQuery 做的選單，改用 React 重寫了。
- 內容都放在 `data/*.json`，修改 JSON 就能改網站內容。之後可以換成後台 CMS 或資料庫。
- 聯絡表單會透過 Resend 把詢問寄到公司信箱，設定方式寫在 `DEPLOY.md`。之後要接 AI 詢價報價流程，從 `app/api/contact/route.ts` 加。
- 網站已內建 sitemap.xml、robots.txt、每頁的 title、description 和 canonical，以及公司結構化資料。

## 部署

部署到 Cloudflare 的步驟寫在 **`DEPLOY.md`**。設定好之後，push 到 GitHub 就會自動上線。

## 下一步：加上電商

- `lib/data.ts` 裡的 `Product` 型別就是之後商品的資料模型，加上價格、庫存、規格選項等欄位就能用。
- `/products/parts/[slug]` 可以直接改成商品頁，加上購物車或下單按鈕。
- 可以選的做法：
  1. 自建：Next.js 搭配資料庫（例如 Postgres 或 Supabase），金流用綠界、藍新或 Stripe。
  2. Headless Shopify：商品和結帳交給 Shopify，前台用這個專案。

## 產品型錄（/products/parts）

- 商品資料在 `data/catalog.json`，來源是 Claude Sheet「寶楠 產品型錄」中的「產品型錄」分頁，由 `scripts/build_catalog.py` 轉出。
- **只會匯出可以公開的欄位**：進價、毛利率、進貨渠道、主要客戶、價格備註都不會進到網站或 repo。
- 售價只顯示**近 3 年內**的成交價，超過 3 年的顯示「請詢價」，年限可以在 `PRICE_MAX_AGE_DAYS` 調整。
- 商品照片目前是比對舊官網已有的照片，比對不到的顯示品牌和分類的佔位圖。要補照片，把圖片放進 `public/` 底下，再在 `catalog.json` 的 `image` 欄位填上路徑。
- 詢價單存在瀏覽器裡（localStorage）。送出後由 `/api/inquiry` 寄信給公司，信件內容包含每個品項的型號、數量、參考價和交期。
