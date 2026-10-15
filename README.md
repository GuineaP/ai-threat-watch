> 現行閱讀版：2026-10-10；整合完成日：2026-10-14。44篇案例與四條導讀已完成修訂。[修改與維護說明](docs/independent-copyedit-2026-10-10.md)。

# AI 威脅觀察

**AI Threat Watch｜繁體中文威脅情報導讀**

把艱深的威脅情報報告，變成可以一起理解、質疑與討論的繁體中文材料。

讀懂，而不是逐字翻譯。有多少證據，就說多少話。

本站定位是繁體中文深度導讀、案例索引與台灣及公民社會觀察，面向沒有資安背景也希望理解威脅情報的讀者。這不是 Anthropic 官方中文翻譯。

## 第一階段範圍

Anthropic《Detecting and countering misuse of AI: September 2026》：

- **43 main case units**：Cyber 5、Influence 9、Surveillance 10、Conventional weapons 6、Biological misuse 5、Scams and fraud 1、Illicit distillation 7。
- **1 embedded supplemental case**：GTG-50021，不計入主要 43 案。
- **44 indexed entries**。

GTG-16012（SenseTime）與 GTG-16003（MiniMax）分開索引，`source_group` 保存共用原報告標題的關係。

44篇10月4日版完整正文已匯入網站副本，原始文章保持原狀。新增四條生活問題導讀、卡片摘要、搜尋與台灣關係篩選；事件導語在前，目錄依實際小標產生。

2026-10-07本機預覽與檢查見 [閱讀改版驗證](docs/reading-preview-2026-10-07.md)。先前的 [validation](docs/validation.md) 是舊版歷史紀錄，不能當成本版驗證。

## 本機使用

使用 Node.js 22.12 以上的受支援版本與 pnpm 10.17.1；CI 使用 Node.js 24。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm preview
```

建置會執行 Astro／TypeScript 檢查，再驗證案例數、章節數、共用標題關係、新版正文及來源雜湊、四條導讀、目錄錨點、全部內部連結與靜態資產。輸出位於 `dist/`。

## Routes

`/`、`/guides/`、`/guides/[slug]/`、`/corrections/`、`/reports/`、`/reports/[reportId]/`、`/reports/[reportId]/overview/`、`/reports/[reportId]/cases/`、`/reports/[reportId]/cases/[slug]/`、`/topics/`、`/topics/[slug]/`、`/glossary/`、`/methodology/`、`/about/`、`/license/`。

## 專案結構

```text
src/content.config.ts       所有 Content Collection schema
src/content/guides/         四條生活問題導讀與有序案例列表
src/content/reports/        各機構報告與來源資訊
src/content/cases/          按 report_id 分組的案例 Markdown／MDX
src/content/glossary/       術語與原始來源
src/content/topics/         主題頁
src/content/pages/          首頁文字、方法、About、權利說明
src/components/             閱讀與證據元件、案例索引
src/layouts/                全站與文章 layout
src/pages/                  靜態路由
src/lib/                    資料查詢與部署路徑
src/scripts/                必要的案例篩選互動
src/styles/                 全站可讀與響應式排版
templates/                  編輯模板
docs/                       規格、內容狀態、差異與驗證結果
scripts/verify-output.mjs   建置資料與輸出驗證
.github/                    建置 CI、Issue 與 PR 模板
```

## 新增內容

複製 `templates/` 模板或現有案例至 `src/content/`。可使用一般 Markdown；需要「這是什麼？」或證據元件時使用 MDX。現有 frontmatter 使用 JSON 格式（合法 YAML），以明確保存 null 與字串；也可以直接使用一般 YAML，驗證器採 Astro 的 frontmatter parser。MDX 註解使用 `{/* 註解 */}`，不要使用 HTML 註解。

`case_unit` 區分 main／embedded；`selected_for_deep_dive` 表示選案；`deep_dive=true` 只用於 `status=published` 的完整導讀。不要以未知資料代表 false／No。`source_id` 保留原來源識別碼，生物案例的 `BIO-CASE-*` 僅為本站識別碼。

## 部署與原始碼

網站輸出為靜態檔案，位於 `dist/`。已於2026-10-15部署至 Cloudflare Pages，正式網址為 [ai-threat-watch-tw.pages.dev](https://ai-threat-watch-tw.pages.dev/)，不含個人帳號。此次採手動 Direct Upload；部署與驗證紀錄見 [Cloudflare Pages](docs/cloudflare-pages.md)。

GitHub 用於保存原始碼與驗證。推送及PR會執行 `ci.yml` 的內容、建置與根／子路徑檢查。`deploy.yml` 只保留手動觸發，不會因推送原始碼而另外公開 GitHub Pages 網站。

在一般靜態託管使用 `BASE_PATH=/`；若部署到子路徑，再依實際網址設定 `BASE_PATH`。只有已知正式網域時才設定 `SITE_URL`。`.github/workflows/deploy.yml` 是可選的 GitHub Pages 流程，啟用前需確認網址與受眾符合需求。

## 更正回報的實際功能

目前表單僅在讀者瀏覽器內整理、複製更正說明，不會寄信、不會傳送到伺服器，也沒有後台收件匣。頁面明示「尚未傳送」。真正收件功能須另外串接並驗證。

## 協作、方法與權利

- [CONTRIBUTING](CONTRIBUTING.md)：第一階段接受 typo、失效連結、引用、事實與 metadata 修正；核心文章與台灣觀察由 G 決定。
- [METHODOLOGY](METHODOLOGY.md)：四層證據、選案偏差與 AI 使用揭露。
- 原創內容採 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh-hant)，原創網站程式碼採 [MIT](LICENSE)，允許分享、修改及商業使用。授權範圍與第三方材料說明見 [CONTENT_LICENSE](CONTENT_LICENSE.md)。

原 PDF、全文抽取結果及大量第三方原圖不提交。AI 可能犯錯；重要資訊應回查原報告。
