# 閱讀改版第一版｜2026-10-07

本機預覽：http://127.0.0.1:4321/ 。尚未推送 GitHub、建立遠端或部署。

2026-10-08交付前再次檢查：44篇正文完整性、四條導讀與1,110個內部連結／資產通過，現有預覽可正常開啟。

## 完成內容

- 首頁以生活問題帶路，四條導讀各有三篇案例。手機省略桌面的閱讀步驟圖，讓問題較早出現；NGO 入口改成「公益團體」。
- 44篇10月4日版完整正文已匯入發布副本；只移除原稿標題及識別行，改由頁面標題與 metadata 顯示。正文逐字相等，原稿未修改。
- 44份卡片摘要由編輯撰寫，保留主要成果限制。題材分類重用章節，不新增威脅分數或國家排名。
- 主要搜尋標題、導語及ID；兩種台灣關係可重疊，其他 direct 保持 unknown。回案例庫保留條件，無結果有提示。
- 目錄由實際小標產生，放在導語後；原有編者延伸與來源段落另有版面區塊。重要結果差異不藏於收合區。
- 提供字級控制、鍵盤可用的手機選單、跳到正文、PDF 頁碼與官方來源、相關閱讀、更正說明整理頁。
- About 保留既有 G 自介，補充來源範圍、商業位置與編者責任。來源正文不等於本站底層獨立查證。

## 本輪實測

| 檢查 | 結果與範圍 |
| --- | --- |
| Astro／TypeScript | 38個檔案，0 errors／0 warnings／0 hints |
| 靜態建置 | 68頁 |
| 正文完整性 | 44份來源 SHA-256 相符，網站正文與來源版移除標題／ID後完全相同；來源頁序相同 |
| 資料關係 | 43 main＋1 embedded、章節數、九個歷史選案旗標、商湯／MiniMax與其他source_group關係保留 |
| 閱讀與連結 | 四條導讀各三篇、所有案例目錄錨點；根路徑1,110個內部連結與資產通過 |
| GitHub Pages 子路徑 | fixture `/reading-preview/`，1,110個內部連結與資產通過；實際開首頁、選單、案例庫及搜尋成功 |
| 螢幕尺寸 | 首頁、主題、54004、14020、14010、案例庫、About、16003共8種頁面，320／360／390／768／1280px共40次，無整頁橫向溢出，每頁一個h1 |
| 大字模式 | 14010於320px，21px字級仍無整頁溢出，來源內部成果差異可見 |
| 鍵盤 | Enter開啟手機選單、Escape關閉並回焦點；「跳到正文」使main取得焦點 |
| 搜尋與返回 | 台灣記載篩出3篇、ID搜尋至1篇，進入案例再返回保留query，無結果顯示0篇與提示 |
| 不載入腳本 | 使用移除script的靜態fixture；44篇列表、鍵盤進入14010、導語、來源及成果差異均可讀。未更動瀏覽器JavaScript設定，不稱為所有瀏覽器停用腳本的完整驗證 |
| 更正頁 | 預填案例ID、整理說明與「尚未傳送」提示通過。未傳送資料，沒有收件後端 |
| 來源版本 | 2026-10-05下載官方PDF，與引用檔SHA-256同為cdea01e84f61de63ad80eabaa949047290921eaa2bec738d401b06eef6adfb1c |

畫面與逐次紀錄保存在 `qa/reading-preview-2026-10-07/`：五種頁面的手機／桌面截圖、browser-checks.json、subpath與script-free檢查頁。qa已排除於Git，不作公開內容。完整68頁的逐頁使用者操作、200%瀏覽器縮放、螢幕閱讀器及全面WCAG稽核未宣稱完成。

最後檢查發現舊輸出殘留頁面引用過期資產，已將整份舊輸出保留至 qa/reading-preview-2026-10-07/output-before-clean-build/，再乾淨重建。68頁與根路徑1,110個內部連結重新通過；未忽略失效連結。

## 更新與重現

在專案根目錄使用既有環境：

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm preview --port 4321
```

本輪因桌面環境的套件啟動器會自動要求重裝，直接以已安裝的Node執行Astro CLI完成check與build，並獨立執行 `node scripts/verify-output.mjs`。已補入官方 `@astrojs/markdown-remark`，使用Unified處理器讓閱讀HAST元件可正常建置，依據 [Astro Markdown說明](https://docs.astro.build/en/guides/markdown-content/#setting-up-a-markdown-processor)。package與lockfile一致。

匯入器預設僅檢查，加 `--write` 才改網站副本：

```sh
node scripts/import-full-edition.mjs
node scripts/import-full-edition.mjs --write
```

原始稿、索引與PDF位於 `../editorial-audit/revised-edition-2026-10-04/`。匯入前網站src與scripts備份位於 `../editorial-audit/website-design-2026-10-05/site-before-content-import.tar.gz`，其中不含原PDF。這是內容匯入前快照，已包含本輪初始guide schema／reading lib調整，不是完整原始基線。

## 尚待人類決定與驗證

- 五名一般讀者的理解測試尚未做，不能將技術檢查當作已證明「看法更理性」。
- 正式更正收件窗口、內容及程式碼授權、GitHub repository與是否發布仍由G決定。
- 本版關聯閱讀先依共同導讀、共用來源與同章節挑選。可再以讀者回饋精修每篇的比較理由。
- 公開前重新核對重要歸因、數字與對台推演；新版PDF或其他機構來源需另行比對，不可只替換連結。
