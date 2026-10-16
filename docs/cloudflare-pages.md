# Cloudflare Pages 正式部署

- 正式網址：https://ai-threat-watch-tw.pages.dev/
- 授權頁：https://ai-threat-watch-tw.pages.dev/license/
- Cloudflare 專案：ai-threat-watch-tw；正式分支：main。
- 發布日期：2026-10-15（台灣時間）。
- 部署來源提交：e9e007ed27cd1b6c3decb33ba70da64e30135896。
- 部署 ID：1d85eeb7-0667-4f75-b4de-e2d2159a51a5。
- 此版網址：https://1d85eeb7.ai-threat-watch-tw.pages.dev/。

## 首次上線紀錄（2026-10-15）

首次上線使用手動 Direct Upload 發布預先建置的 dist。以下保留當時流程。

1. 確認欲部署的提交、工作目錄與內容檢查通過。
2. 建置時設定 SITE_URL=https://ai-threat-watch-tw.pages.dev、BASE_PATH=/。本地若設定 GITHUB_REPOSITORY 也需明確覆寫 BASE_PATH，避免沿用 GitHub 子路徑。
3. 以已授權的 Wrangler 執行 pages deploy dist --project-name ai-threat-watch-tw --branch main --commit-hash <本次提交>。
4. 確認 Cloudflare canonical deployment 成功，再匿名檢查正式首頁、案例、導讀、授權頁與 CSS／JS。供應商回報 success 不取代網站實際可讀取的驗證。

本次已核對正式 HTML 頁面的主要標題與語言，以及靜態資源內容；授權頁顯示 CC BY 4.0 與 MIT。詳細 HTTP 結果保存於本機 qa/deployment-2026-10-15/live-http-checks.json（不提交）。此前 522 紀錄保留，沒有刪除；本次重新部署後正式網址已可讀取。

沒有設定自訂網域、資料庫、後端或額外追蹤服務。

## 自動部署（2026-10-16）

流程位於 .github/workflows/ci.yml：push main 或手動執行 → 內容及根／子路徑建置驗證 → 保存根路徑 artifact → Cloudflare Pages → 匿名比對正式網站與 artifact。兩個建置都必須成功，PR 不部署，憑證不提供給 PR 工作。部署佇列避免兩次發布同時進行；token 不輸出到日誌。

### 一次性啟用

狀態：工作流程已建立；必須完成以下 Secret 設定，並看到一次 Actions 部署與線上驗證成功後，才算啟用完成。

1. 在 Cloudflare 的 Account API tokens 建立自訂 Token，權限只選 Account → Cloudflare Pages → Edit，帳號限定為現有網站的帳號。不要使用 Global API Key 或本機 OAuth token。
2. 到 https://github.com/GuineaP/ai-threat-watch/settings/secrets/actions ，新增 Repository secret，名稱 CLOUDFLARE_API_TOKEN，值填入剛建立的 token。不要貼到聊天、README 或程式碼。
3. Account ID 已在工作流程指定，不是密碼，不需另設 Secret。
4. 到 https://github.com/GuineaP/ai-threat-watch/actions/workflows/ci.yml 選 Run workflow、main，或推送 main。確認 build 和 deploy 都成功。

如果缺少 token，部署會明確失敗，現有網站仍維持前一個版本。GitHub 連接工具目前無 Actions Secret 寫入功能；本機沒有已授權的 GitHub CLI，故 token 設定需由儲存庫管理者完成。

### 驗證與維護

- SITE_URL 固定正式網域、BASE_PATH=/；不沿用 GitHub Repository 子路徑。
- 部署的是 build 檢查通過後保存的 artifact，不在 deploy 階段重新編譯。
- scripts/verify-live-deployment.mjs 匿名抓取所有 HTML、CSS、JS 等產物，逐位元組比對本次 artifact；若網站仍是舊版或回傳錯誤，工作流程會失敗。
- 網站內容更新不需要另按部署；主分支變更包含導讀、程式與文件都會觸發。
- 憑證到期或撤銷後，更新同名 Secret 即可。若日後只調整文件不想發布，可再加入 paths 過濾；目前不做可能漏掉內容相依變更的過濾。

官方流程：https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
