> 狀態更新（2026-10-15）：正式網站現使用 Cloudflare Pages：https://ai-threat-watch-tw.pages.dev/ 。本頁保留舊 GitHub Pages 設定供參考，已非現行部署策略；deploy.yml 僅可手動觸發，不會隨 main 推送發布。現行流程見 cloudflare-pages.md。

# GitHub Pages 設定

部署策略由 G 於 2026-09-12 確認：僅使用 GitHub Pages，不使用其他 hosting service，不設定 custom domain。

Workflow 依 [Astro 官方文件](https://docs.astro.build/en/guides/deploy/github/)：checkout → `withastro/action` 安裝、建置並上傳 Pages artifact → `actions/deploy-pages` 部署。具備 `contents: read`、`pages: write`、`id-token: write` 與 `github-pages` environment，push 到 `main` 自動執行。

此 Astro 專案資料夾必須是 GitHub repository 根目錄，`.github/` 才會被 GitHub 讀取。本機上層「網站架設」資料夾不是要提交的專案根目錄。

## site／base

- Actions 自動提供 `GITHUB_REPOSITORY`，設定檔取出真正的 owner／repository。
- `site`：`https://<owner>.github.io`。
- `base`：`/<repository>/`。
- 最終網址：`https://<owner>.github.io/<repository>/`。
- 本機沒有此資訊時，`site` 留空、`base=/`；不猜測帳號或遠端名稱。
- 如需本機測試子路徑，可暫時設定 `SITE_URL`、`BASE_PATH` 環境變數；測試值不是實際部署目標。

## 建立 repo 後

1. 以專案資料夾為根建立公開 GitHub repository，連接實際 remote，主分支為 `main`。
2. 檢查內容與程式碼授權，以及待編輯文章的公開狀態；原 PDF 與全文抽取結果不提交。
3. Settings → Pages → Source 選 **GitHub Actions**。
4. 確認 repository 允許執行 Actions，並將 main push 到 remote。
5. 等待 build 與 deploy job 成功；從 environment 的實際 `page_url` 開啟網站。
6. 驗證 GET 首頁、案例頁、術語錨點與 CSS／JS；手機閱讀與篩選也需在真實子路徑確認。

不需要額外填 GitHub username secret、PAT、custom domain、DNS 或 CNAME。本輪沒有建立 remote、推送或觸發部署；真實 GitHub Actions 部署尚未驗證。
