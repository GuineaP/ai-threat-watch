# Editorial Spec｜已修正版本

2026-09-12 更新：43 main case units、1 embedded supplemental case（GTG-50021）、44 indexed entries。GTG-16012 與 GTG-16003 分開索引，共用原文節標題透過 source_group 保存。其餘編輯理念與確認文字維持原規格。

我要建立一個公開 GitHub 專案與靜態 HTML 網站。

專案暫名：

AI 威脅觀察
AI Threat Watch｜繁體中文威脅情報導讀

請先閱讀以下完整產品與編輯規格，再開始實作。
不要自行大幅改變資訊架構或編輯理念。
遇到內容尚未提供時，建立可填充的 placeholder，而不是自行編造案例內容。


==================================================
一、專案目的
==================================================

這是一個面向台灣繁體中文讀者的公共知識專案。

第一階段整理 Anthropic 2026 年 9 月發布的：

Detecting and countering misuse of AI: September 2026

但架構需要預留未來加入：

- Google Threat Intelligence / TAG
- Microsoft Threat Intelligence
- OpenAI threat reports
- Meta threat reports
- 其他高品質公開威脅情報

因此 repository、route 與資料 schema 不可以寫死 Anthropic。


這不是 Anthropic 報告的完整中文翻譯。

定位是：

「繁體中文深度導讀＋案例索引＋台灣與公民社會觀察」

核心原則：

1. 讀懂，而不是逐字翻譯。
2. 有多少證據，就說多少話。
3. AI 主導整理，人類決定什麼值得追問。
4. 保持警覺，但不要讓警覺變成互不信任。


==================================================
二、預設讀者
==================================================

主要讀者並非資安研究者。

依序考慮：

1. 一般關心 AI、政治、國際情勢的台灣讀者
2. NGO / 公民社會工作者
3. FIMI、媒體識讀、民主韌性工作者
4. 媒體與政策工作者
5. 資安工作者與研究者

所有正文應以「沒有資安背景也能理解」為基準。

研究或專業讀者仍然必須能透過：
- 英文術語
- 原報告頁碼
- 原始來源
回查資料。


==================================================
三、技術選擇
==================================================

優先使用：

Astro + TypeScript + Markdown/MDX

理由：
- 內容型網站
- GitHub-friendly
- 低維護
- 靜態部署
- 未來非工程背景編輯者可以直接新增 Markdown
- 部署限定 GitHub Pages；以 GitHub Actions 在 push 到 main 時自動 build 與 deploy

原則：

- 不建立複雜 backend
- 不需要登入
- 不需要資料庫
- 不使用重量級 CMS
- JavaScript 只在需要互動時使用
- 手機閱讀體驗優先
- WCAG/accessibility 基本要求
- 支援 dark mode 可做，但不是第一優先
- 不追求花俏動畫


==================================================
四、網站主要資訊架構
==================================================

建立：

/

首頁


/reports/

報告列表


/reports/anthropic-2026-09/

Anthropic 報告專題首頁


/reports/anthropic-2026-09/cases/

完整案例索引


/reports/anthropic-2026-09/cases/[slug]/

個別案例


/reports/anthropic-2026-09/overview/

10 分鐘看懂這份報告


/topics/

主題頁

至少預留：
- cyber
- influence-operations
- surveillance
- fimI
- china
- civil-society
- democratic-resilience


/glossary/

繁中／英文術語表


/methodology/

方法與編輯原則


/about/

關於專案與 G


==================================================
五、首頁內容
==================================================

首頁需要先傳達這個網站「為什麼存在」，而不是先展示技術。

首頁 hero 可使用：

AI 威脅觀察
把艱深的威脅情報報告，變成可以一起理解、質疑與討論的繁體中文材料。

副標：

讀懂，而不是逐字翻譯。
有多少證據，就說多少話。


首頁前段放以下內容，文字可做排版優化，但不要改變意思：


「為什麼整理這些報告？」

我對 FIMI、中國威脅、民防與台灣民主韌性一直有明確的擔憂。

這些擔憂並不是抽象的。威權國家確實曾經進行資訊操弄、監控、網路攻擊與跨國鎮壓；新的 AI 工具，也正在降低其中一些行動的成本。

但我同時擔心另一件事。

當資訊越來越多、政治立場越來越極化，而我們又知道確實有人試圖操弄資訊環境時，很容易開始把「有可能」當成「一定是」，把「值得懷疑」直接變成「我早就知道是他們做的」。

久而久之，我們可能不只是不相信可疑資訊，而是開始不相信彼此。

對我來說，這不是一個健康的民主社會面對資訊威脅的方式。

所以我想試著做另一件事：回到比較接近第一手的威脅情報報告，看研究者到底看到了什麼、證據支持到哪裡、他們自己又有哪些地方保持不確定。

這不是為了證明「我原本對中國或 AI 的擔憂都是對的」，也不是拿報告來證明「沒有防備心的人太天真」。

我更希望它能幫助我們練習一件事：

「有多少證據，就說多少話。」

看到風險時保持防備；證據不足時保留判斷；有合理懷疑時繼續追問，而不是急著替故事補上結局。

因為如果面對資訊操弄的結果，是讓民主社會裡每一群人都開始把彼此當成潛在敵人，那麼即使我們沒有相信某一則假訊息，資訊操弄仍可能已經達成部分目的。

「保持警覺，但不要讓警覺變成互不信任；尊重證據，也不要把不確定誤認成沒有風險。」

這個網站不是一本「敵情大全」，而是一份閱讀實驗。

「這個網站本身也是一場實驗：AI 能否協助一般讀者更深入閱讀原本可能沒有時間完整閱讀的威脅情報報告？」

我也是這些報告的讀者之一。AI 負責大量整理、翻譯、比較與初稿工作；我的工作則是持續追問：這句話真的有證據嗎？原文怎麼說？我們是不是推得太遠？以及，這件事對台灣到底值得擔心到什麼程度？

—— G


首頁接著放一個視覺上簡潔的：

「怎麼閱讀本站」

四個原則：

有風險，不等於每個懷疑都是真的。

沒有足夠證據，不等於已經證明沒這回事。

不能排除某種可能，也不等於這個可能已經得到證實。

我們盡量把「看到的事實、研究者的判斷、合理懷疑、編者觀察」分開。


==================================================
六、「這是什麼？」元件
==================================================

這是核心功能之一。

建立 reusable component：

<WhatIsThis />

用途：

正文第一次遇到專有名詞，例如：

Midnight Blizzard
HUMINT
Breakout Scale
C2
state-nexus
FIMI
agentic AI
SVR

讀者可以點：

「這是什麼？」

展開一個 3–5 行的白話說明。

需求：

- 使用原生 details/summary 或同等 accessible solution
- 不要開 modal
- 不要跳頁
- 手機友善
- 可包含：
  - 中文名稱
  - 英文原文
  - 50–150 字說明
  - glossary link
- 正文保持流暢
- 不要把每個普通英文詞都做成元件


==================================================
七、翻譯規則
==================================================

中文閱讀優先。

專業詞第一次出現：

代理型 AI（agentic AI）

人力情報（human intelligence, HUMINT）

來源洗白（attribution laundering）

後續同篇文章只使用中文即可。

不要一直出現：

「本專案暫譯」

在 glossary / methodology 統一聲明：

本站部分技術與研究用語沒有一致的繁體中文譯法。為提升台灣讀者閱讀流暢度，本站會提出中文譯名，第一次出現時原則上保留英文原文。除非另有說明，這些中文名稱屬本站編輯選擇，不代表原作者官方譯名或學界一致用語。


若英文原句具有分析價值，中文必須先能獨立理解，例如：

AI 不只是協助產生內容，也開始協助建造整套操作體系
（AI helping build the apparatus, not merely the content）

不要要求讀者靠英文才能理解。


==================================================
八、案例文章固定模板
==================================================

每一篇深度案例依序使用：

1. 案例資訊
2. 一句話看懂
3. 發生了什麼？
4. AI 在這裡做了什麼？
5. AI 沒做什麼？
6. AI 改變了什麼？
   - Speed
   - Scale
   - Depth
7. 人類還在哪裡？
8. 安全措施有作用嗎？
9. 我們手上的證據可以把話說到哪裡？
10. 編者觀察｜為什麼台灣值得注意？
11. 閱讀時要保留什麼？
12. 詞彙
13. 原始來源


==================================================
九、證據與推論元件
==================================================

案例中固定建立一個 visually distinct 但不要像「警告框」的區域：

「我們手上的證據可以把話說到哪裡？」

裡面可以有四個層次：

【我們知道的】
報告直接觀察或資料直接支持的事情。

【報告怎麼判斷】
Anthropic 或其他機構的分析與 attribution。
如有 high / medium / low confidence 必須保留。

【合理會產生的懷疑】
根據目前跡象，一般讀者自然可能提出哪些問題。
這不是結論。

【目前還不能當成事實的部分】
目前缺乏哪些資訊。
若要進一步確認，需要什麼類型的新證據。


核心方法：

「尚無足夠證據」
不等於
「已經證明不存在」。

「不能排除」
也不構成
「這件事情很可能是真的」的證據。


網站語氣應偏向審議民主與公共討論，
不是法律判決書，
也不是學術論文。


==================================================
十、資料 Schema
==================================================

建立 Astro Content Collection schema。

case 至少支援：

id
slug
title_zh
title_en

report:
  publisher
  report_id
  section
  pages

actors:
  operator
  commissioner
  beneficiary

regions

targets

relationships:
  attribution_country
  content_source_country
  operator_location
  target_country

attribution:
  observed
  assessed
  confidence
  not_established

ai_scope:
  performed
  not_performed

autonomy:
  level
  human_roles

uplift:
  speed:
    assessment
    evidence
  scale:
    assessment
    evidence
  depth:
    assessment
    evidence

safeguards:
  refusals_observed
  refused_tasks
  circumvention_observed
  residual_capability

outcome:
  confirmed
  attempted
  unknown

reach:
  observed
  claimed
  independently_verified
  breakout_scale

taiwan_relevance:
  direct
  analogous
  editorial_analysis

terms

sources

deep_dive: true/false


不要強迫不存在的欄位填資料。
null / unknown 必須是一個合法狀態。


==================================================
十一、完整案例索引
==================================================

Anthropic 這份報告整理為：

43 個主要案例
＋
1 個內嵌但值得另外索引的 GTG-50021

建立 case index。

列表至少顯示：

- 中文案例名
- 原英文名
- ID
- 章節
- 地區 / actor
- 一句話摘要
- AI 主要用途
- 台灣直接相關 Yes / No
- 台灣類比價值
- 是否有深度導讀
- 原報告頁碼

需要提供 filter：

- report section
- country / region
- actor type
- Taiwan relevance
- deep dive
- topic

第一版不需要全文搜尋。


==================================================
十二、九個第一階段深度案例
==================================================

Deep dive：

Cyber
1. GTG-20006
2. GTG-10007

Influence
3. GTG-84005
4. GTG-34001
5. GTG-84006

Surveillance
6. GTG-14010
7. GTG-14020
8. GTG-14021
9. GTG-14022


選案說明：

這不是「全報告最嚴重九案」。

主要依據：

- 台灣直接相關性
- FIMI
- 民防
- 中國相關安全威脅
- 公民社會
- 民主韌性
- 能否展示不同類型的 AI uplift
- 是否有足夠資料討論證據與不確定性

公開揭露兩層 selection bias：

1. Anthropic 已先從自己看到的行動中挑出 notable / novel cases。
2. 本站再從 Anthropic 的案例中挑出台灣值得深讀的案例。


==================================================
十三、目前已有三篇測試文章
==================================================

先為下列三篇建立完整頁面：

GTG-14010
中國相關監控與招募行動：
AI 如何跨越語言、人力與情報分析門檻

GTG-84005
馬來西亞選舉操弄平台：
一千個假帳號、選民微定向與 Malaysia Pulse 假新聞網站

GTG-20006
俄羅斯相關網路間諜行動：
當 AI 從助手變成攻擊流程的協調者


目前如果 workspace 中沒有三篇完整 Markdown，
先建立內容 placeholder / template，
不要自行根據網路重新創作完整文章。

內容之後會由編輯者補入。


==================================================
十四、About 頁
==================================================

編輯者使用代號：

G

不要特別強調匿名。
不要營造神秘身份。
也不要將網站做成個人品牌。

About 使用：

「關於 G」

心理系畢業，沒有資安或工程背景。長期在政治與 NGO 領域工作，也投入審議民主與社會議題溝通多年。近年特別關注中國相關安全威脅、資訊操弄、FIMI 與民主韌性。

做這個網站的身分比較接近一個關心這些事情的讀者：看到值得讀、但一般人未必有時間讀完的報告，就試著透過 AI 整理、轉譯，再把閱讀成果公開。

希望這些整理能讓公共討論多一點共同資訊基礎：該警覺的事情好好警覺，但也盡量不要在證據還沒跟上的時候，就急著替事情下結論。


==================================================
十五、AI 使用揭露
==================================================

建立 methodology section：

本專案大量使用生成式 AI 協助：

- 閱讀
- 摘要
- 翻譯
- 分類
- 比較
- 建立資料結構
- 產生初稿

多數內容第一版由 AI 主導完成。

G 主要負責：

- 問題設定
- 選案
- 要求回查原文
- 檢查推論是否過度
- 補充台灣情境
- 最終發布決定

必須明確標示：

這不是 Anthropic 官方中文翻譯。

AI 可能犯錯。
重要資訊應回查原報告。


==================================================
十六、著作權
==================================================

不要把 Anthropic 原報告全文放進 repository。

不要提交原 PDF 到 public repository。

不要大量複製原始圖片。

不要做完整逐段中文翻譯。

我們的網站內容是：

摘要
重新整理
評論
台灣脈絡
自行製作資料結構

Copyright / license 頁應能區分：

1. 本站原創整理、評論
2. 網站 source code
3. Anthropic 與第三方原始內容

不要替 Anthropic 的內容重新授權。


==================================================
十七、GitHub 協作
==================================================

建立：

README.md
CONTRIBUTING.md
METHODOLOGY.md 或網站對應 source
CONTENT_LICENSE.md

Issues 開放。

PR 第一階段主要接受：

- typo
- broken links
- citation corrections
- factual corrections
- metadata corrections

核心文章與台灣觀察保持 editor-controlled。


==================================================
十八、UI / Design
==================================================

設計氣質：

- 冷靜
- 易讀
- 公共知識
- 不做駭客電影風
- 不用大量紅黑配色
- 不製造戰情室感
- 不做愛國宣傳風
- 不營造恐慌

它應該比較接近：

「一份很好讀的公共議題報告」

而不是：

「國安威脅 dashboard」


視覺層級需要清楚區分：

原報告內容
Anthropic judgement
合理懷疑
G 的編者觀察


可以用：

icon
左側 border
背景差異
小標籤

但不要讓整頁變成大量警告框。


==================================================
十九、第一輪實作任務
==================================================

請依序執行：

Phase 1
初始化 Astro 專案與 directory structure。

Phase 2
建立 Content Collections schema。

Phase 3
建立：
- global layout
- homepage
- report landing
- case index
- individual case page
- glossary
- methodology
- about

Phase 4
建立 reusable components：
- WhatIsThis
- EvidenceBoundary
- EditorObservation
- Term
- SourceReference
- CaseMetadata
- UpliftSummary

Phase 5
建立三篇 placeholder / sample cases，
驗證 Markdown / MDX rendering。

Phase 6
加入 case filters。

Phase 7
設定 GitHub-friendly build。

Phase 8
建立 README 與 CONTRIBUTING。


完成後：

1. run build
2. 修正所有 TypeScript / Astro error
3. 檢查手機版
4. 檢查 accessibility
5. 告訴我目前 repo structure
6. 告訴我下一步只需要提供哪些內容資料

不要自行部署到 production，
先讓我本機或 preview 檢查。
