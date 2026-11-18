# 部署到 Cloudflare（push 到 GitHub 就自動上線）

這個專案已經設定好可以部署到 Cloudflare Workers：

- 部署設定已寫好（`wrangler.jsonc`、`open-next.config.ts`）。
- 程式打包壓縮後約 1.1 MB，低於免費方案的 3 MB 上限，所以先用免費方案就可以。
- 圖片和 PDF 會放在 Cloudflare 的 CDN 上，台灣使用者會從台北的節點讀取。

## 一、第一次設定（約 20 分鐘）

### 1. 把專案放上 GitHub
1. 到 https://github.com/new 建立一個 **Private（私有）** repo，例如 `bonatek-site`。
2. 在專案資料夾裡依序執行：
   ```bash
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<你的帳號>/bonatek-site.git
   git push -u origin main
   ```

### 2. 讓 Cloudflare 連上 GitHub
1. 註冊並登入 https://dash.cloudflare.com 。
2. 左側選 **Compute (Workers) → Workers & Pages → Create → Import a repository**，選剛剛建立的 repo。
3. 建置設定這樣填：
   - **Build command**：`npx opennextjs-cloudflare build`
   - **Deploy command**：`npx opennextjs-cloudflare deploy`
   - **Production branch**：`main`
4. 按 **Deploy**，大約 3 到 5 分鐘後，會拿到一個 `https://bonatek-site.<你的帳號>.workers.dev` 測試網址。

之後只要 `git push` 到 main，Cloudflare 就會自動重新建置並上線。推到其他分支的話，會產生一個預覽網址，方便先確認改得對不對。

### 3. 設定聯絡表單寄信
表單是透過 [Resend](https://resend.com) 寄信的，免費方案每天可以寄 100 封。
1. 註冊 Resend，在 **Domains** 加上 `bonatek.com.tw`，照畫面指示加 DNS 紀錄（第 4 步把網域移到 Cloudflare 之後，在 Cloudflare 的 DNS 頁面加）。
2. 在 Resend 建立一把 **API Key**。
3. 到 Cloudflare 的 Worker 頁面，進 **Settings → Variables and Secrets**，加上這三個設定：
   - `RESEND_API_KEY`：類型選 **Secret**，值填 Resend 的 API Key。
   - `CONTACT_TO`：收件信箱，例如 `sales@bonatek.com.tw`；有多個收件人就用逗號分隔。
   - `CONTACT_FROM`：寄件人，例如 `寶楠科技官網 <noreply@bonatek.com.tw>`。

還沒設定好之前，表單送出仍會顯示「成功」，詢問內容可以在 Worker 頁面的 **Logs** 裡看到，不會遺失。

### 4. 換到正式網域 bonatek.com.tw
1. 在 Cloudflare 選 **Add a domain**，輸入 `bonatek.com.tw`，選 Free 方案。Cloudflare 會自動把現有的 DNS 紀錄抄過來。
2. **務必確認公司信箱的 MX 紀錄有被抄過來**，不然換網域後會收不到信。
3. 到網域註冊商（例如 Hinet、PChome），把 Nameserver 改成 Cloudflare 給的那兩組。
4. 回到 Worker 頁面，在 **Settings → Domains & Routes → Add → Custom domain** 加上 `bonatek.com.tw` 和 `www.bonatek.com.tw`。
5. 新網域生效後，舊的 `.php` 網址會自動 301 轉到新網址，Google 收錄的連結不會失效。

## 二、SEO 設定

上線後需要做的：
1. **Google Search Console**：新增資源 `bonatek.com.tw`，選「網域」類型，用 DNS TXT 紀錄驗證（在 Cloudflare 的 DNS 頁面加一筆 TXT 就好）。驗證後提交 `https://bonatek.com.tw/sitemap.xml`。
2. **Bing Webmaster Tools**：可以直接從 Search Console 匯入。
3. **Google Analytics 4（選用）**：建立資源後把評估 ID（`G-XXXXXXX`）給我，我幫你加進網站。

網站已內建以下 SEO 設定：

- `/sitemap.xml`：649 個網址，會自動產生。
- `/robots.txt`
- 每一頁都有自己的 title、description 和 canonical。
- 分享到社群時顯示的預覽圖（Open Graph）。
- 公司結構化資料（Schema.org Organization），讓 Google 讀得懂公司名稱、電話和地址。

## 三、本機指令

| 指令 | 用途 |
|---|---|
| `npm run dev` | 開發模式（http://localhost:3000） |
| `npm run preview` | 用和 Cloudflare 一樣的執行環境在本機測試（http://localhost:8787） |
| `npm run deploy` | 不經過 GitHub，從本機直接部署（第一次要先執行 `npx wrangler login`） |

> Windows 小提醒：Cloudflare 的建置工具在 Windows 上偶爾會出問題。平常開發用 `npm run dev` 就好，部署交給 Cloudflare 自動執行，不需要在自己電腦上跑 build。
