# 第一輪驗證結果

2026-09-12。本機實作與驗證完成，等待 G 檢查；未建立 GitHub remote、未 push、未執行正式部署。

## 建置與資料

- `pnpm build` 通過：Astro／TypeScript 0 errors、0 warnings、0 hints；62 個靜態頁面（含 404）。
- 驗證 43 個主要案例、1 個內嵌補充案例、44 筆索引；七個章節數量一致。
- 九個第一階段選案一致；三篇待編輯 MDX 頁面各保留十三段結構。
- SenseTime／MiniMax 與生物案例 4／5 各自保留獨立案例單元及共用來源標題關係。
- 788 個內部連結及靜態資產路徑通過檔案存在檢查。
- 首頁完整「為什麼整理這些報告？」與「關於 G」內容已和提供的規格逐字比對，一致。
- repository 無原 PDF 或全文抽取結果；研究正文、摘要、歸因及台灣觀察尚未補寫。

## 本機瀏覽器

- 61 個內容頁面 HTTP 回應正常，無偵測到執行錯誤或失敗資產。
- 使用 axe-core 檢查 WCAG 2 A／AA、WCAG 2.1 AA 與 best practices 標籤，未偵測到違規。自動檢查不代表已完成所有人工無障礙審查。
- 320、390、1440px 的代表頁面沒有橫向溢出；390px 下 200% 文字放大亦通過。
- 六類篩選、組合篩選、結果計數、清除與無結果狀態通過；Cyber 索引為六筆，其中五筆主要案例與一筆補充案例。
- 未知台灣相關性保持未知；篩選 Yes／No 都不會包含未知資料。
- 原生 details／summary 可由鍵盤展開；跳至主要內容連結正常。
- 停用 JavaScript 時仍顯示完整 44 筆索引。
- 已人工檢視桌面首頁、手機首頁、案例索引與四層證據區域截圖。

## GitHub Pages 子路徑

使用明確的測試 fixture（不是實際帳號／repo）在獨立暫存輸出驗證：

- `site`／`base` 從 `GITHUB_REPOSITORY` 正確推導。
- canonical URL、所有內部連結及資產包含 repository base。
- 子路徑首頁、CSS／JS、案例列表、篩選、個案頁及術語錨點在本機 HTTP 與瀏覽器檢查通過。
- 原本根路徑 `dist/` 與 `http://127.0.0.1:4321/` preview 保留供 G 檢查。

部署 workflow 已依 Astro 官方流程準備，但 GitHub Actions 的實際遠端執行、Pages 設定與正式 URL 仍須在建立 repository 後驗證。最後設定見 [github-pages.md](github-pages.md)。

本輪可驗證事實修正僅有案例數從初始 40＋1 改為 43＋1；詳見 [source-discrepancies.md](source-discrepancies.md)。
