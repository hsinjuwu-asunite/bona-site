/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
export default nextConfig;

// Cloudflare 的本機模擬（讀取 bindings 用）。網站目前用不到，且在部分 Windows 環境會啟動失敗，
// 所以預設不開。需要時用 `CF_DEV=1 npm run dev` 啟用。
if (process.env.CF_DEV === '1') {
  const { initOpenNextCloudflareForDev } = await import('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev();
}
