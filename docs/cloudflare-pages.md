# Cloudflare Pages 正式部署

- 正式網址：https://ai-threat-watch-tw.pages.dev/
- 授權頁：https://ai-threat-watch-tw.pages.dev/license/
- Cloudflare 專案：ai-threat-watch-tw；正式分支：main。
- 發布日期：2026-10-15（台灣時間）。
- 部署來源提交：e9e007ed27cd1b6c3decb33ba70da64e30135896。
- 部署 ID：1d85eeb7-0667-4f75-b4de-e2d2159a51a5。
- 此版網址：https://1d85eeb7.ai-threat-watch-tw.pages.dev/。

## 目前更新方式

使用 Direct Upload 發布預先建置的 dist；GitHub 保存原始碼並執行 CI。推送 main 不會自動更新 Cloudflare 網站，也不會觸發 GitHub Pages 發布。

1. 確認欲部署的提交、工作目錄與內容檢查通過。
2. 建置時設定 SITE_URL=https://ai-threat-watch-tw.pages.dev、BASE_PATH=/。本地若設定 GITHUB_REPOSITORY 也需明確覆寫 BASE_PATH，避免沿用 GitHub 子路徑。
3. 以已授權的 Wrangler 執行 pages deploy dist --project-name ai-threat-watch-tw --branch main --commit-hash <本次提交>。
4. 確認 Cloudflare canonical deployment 成功，再匿名檢查正式首頁、案例、導讀、授權頁與 CSS／JS。供應商回報 success 不取代網站實際可讀取的驗證。

本次已核對正式 HTML 頁面的主要標題與語言，以及靜態資源內容；授權頁顯示 CC BY 4.0 與 MIT。詳細 HTTP 結果保存於本機 qa/deployment-2026-10-15/live-http-checks.json（不提交）。此前 522 紀錄保留，沒有刪除；本次重新部署後正式網址已可讀取。

沒有設定自訂網域、資料庫、後端或額外追蹤服務。後續若要自動部署，需另外設定 Git 連動或 CI 部署憑證，不能把目前流程說成已自動化。
