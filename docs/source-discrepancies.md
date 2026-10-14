# 原始來源與規格差異紀錄

## 2026-09-12｜初始案例數誤計，已修正

- 初始 Editorial Spec 誤計為 **40 個主要案例＋1 個 GTG-50021**。
- 經回查編輯者提供的 154 頁 PDF 後，修正為 **43 main case units、1 embedded supplemental case、44 indexed entries**；G 已確認原先漏算非法模型蒸餾章節中的三個獨立 GTG 案例。
- 章節數：Cyber 5、Influence 9、Surveillance 10、Conventional weapons 6、Biological misuse 5、Scams and fraud 1、Illicit distillation 7。
- GTG-50021 位於第 29 頁，是內嵌補充案例，不計入主要 43 案。
- GTG-16012（SenseTime）與 GTG-16003（MiniMax）在第 152–153 頁共用節標題，但按兩個獨立 GTG ID 分開索引；`source_group=anthropic-2026-09-sensetime-minimax` 保存原文關係。
- 生物案例 4／5 在第 136–137 頁共用標題，但原報告明確稱為兩個案例；同樣分開索引並保留 `source_group`。
- 同步範圍：修正版 Editorial Spec、網站資料與頁面、README、METHODOLOGY、content-status。原始使用者附件不改寫。
- 修正不涉及編輯理念、九個深讀案例、十三段模板或已確認文字。

## 本輪其他核對

尚未發現其他「編輯規格與原始 PDF 可驗證事實衝突」。下列為資料處理約定，不是新研究結論：

- 生物案例沒有公開 GTG ID；`BIO-CASE-1` 至 `BIO-CASE-5` 是本站識別碼，`source_id` 保存原報告 Case study 編號。
- 原文的 `GTG 16005`、`GTG 16012`、`GTG 16003` 在資料 ID 與 route 使用一致的連字號格式；英文原標題與 `source_id` 保留原文。
- 頁碼採原報告印刷頁碼；本附件與 PDF 頁序一致。相鄰案例可能在同一頁交接，因此頁碼範圍可能重疊。
- GTG-50021 沒有獨立案例標題，`title_en` 留空，不替它製造原英文案例名。
- URL slug 使用小寫 `fimi`；原規格的 `fimI` 是預留主題名稱，未更動議題方向。

後續如發現可驗證事實衝突，以原 PDF 為準，在此記錄來源位置、原規格、修正值、影響檔案，並於交付報告列出；不靜默修正。
