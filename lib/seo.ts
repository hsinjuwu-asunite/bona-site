/** 正式網址。上線前若網域不同（例如先用 workers.dev 測試），改這裡或設定環境變數 SITE_URL。 */
export const SITE_URL = (process.env.SITE_URL || 'https://bonatek.com.tw').replace(/\/$/, '');

export const DEFAULT_DESCRIPTION =
  '寶楠科技股份有限公司（Bona Fide Technology）成立於1997年，提供工業級大型不斷電系統 UPS 銷售、維護保養與點檢服務，以及日本機台設備零組件（Parts）供應，服務 TFT-LCD 面板廠與日系企業。';
