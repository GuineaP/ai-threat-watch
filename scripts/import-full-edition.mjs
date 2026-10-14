import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { config, siteRoot, editionRoot, loadEdition, readJSON, bodyOfArticle, sha256, saveOrCheck } from './edition-utils.mjs';
assert.ok(process.argv.slice(2).every(arg => ['--write', '--check'].includes(arg)), '只接受 --write 或 --check；版本由 edition-config.json 指定');
const index = await loadEdition();
const summaries = await readJSON(path.join(editionRoot, 'reading-summaries.json'));
const metadata = await readJSON(path.join(editionRoot, 'site-metadata.json'));
assert.equal(Object.keys(summaries).length, config.article_count, '摘要必須完整涵蓋 44 篇');
assert.equal(Object.keys(metadata).length, config.article_count, '案例屬性必須完整涵蓋 44 篇');
const planned = [];
const provenance = { edition: config.edition, source_sha256: index.source_sha256, articles: [] };
for (const row of index.articles) {
  const article = await readFile(path.join(editionRoot, row.file), 'utf8');
  const body = bodyOfArticle(article);
  const data = structuredClone(metadata[row.id]);
  Object.assign(data, { title_zh: row.title, summary_zh: summaries[row.id], status: 'published', deep_dive: true, updated_at: row.revision_date });
  assert.equal(data.slug, row.id, '不允許改動既有 URL');
  assert.equal(data.report.report_id, config.report_id, '不允許改動來源關係');
  data.report.pages = row.pdf_file_pages;
  data.taiwan_relevance ??= {};
  data.taiwan_relevance.editorial_analysis = body.includes('## 給台灣讀者的啟發') ? '本文有編者對台討論，詳見正文。' : null;
  data.taiwan_relevance.analogous = null;
  data.sources = [{ id: 'original-report', title: 'Anthropic 原報告', url: 'https://www.anthropic.com/threat-intelligence-report-september-2026', pages: row.pdf_file_pages, note: 'PDF 檔案頁序，從1開始；來源說法不等於本站獨立驗證。' }];
  const output = `---\n${JSON.stringify(data, null, 2)}\n---\n\n${body}\n`;
  const target = path.join(siteRoot, 'src/content/cases', config.report_id, row.id + '.md');
  planned.push({ target, output });
  provenance.articles.push({ id: row.id, title: row.title, pages: row.pdf_file_pages, full_sha256: row.sha256, body_sha256: sha256(body), site_sha256: sha256(output), summary_sha256: sha256(summaries[row.id]), prior_sha256: row.prior_sha256 });
}
if (process.argv.includes('--write')) {
  for (const item of planned) await writeFile(item.target, item.output);
  await saveOrCheck('scripts/article-provenance.json', provenance);
  await saveOrCheck('scripts/reading-summaries.json', summaries);
  console.log(`已匯入 ${config.edition} 版全部 ${planned.length} 篇，原稿未改寫。`);
} else if (process.argv.includes('--check')) {
  for (const item of planned) assert.equal(await readFile(item.target, 'utf8'), item.output, `網站與複核稿不同：${item.target}`);
  await saveOrCheck('scripts/article-provenance.json', provenance);
  await saveOrCheck('scripts/reading-summaries.json', summaries);
  console.log(`已核對 ${config.edition} 版全文、摘要、屬性及 ${planned.length} 篇網站副本。`);
} else console.log(`已驗證 ${config.edition} 版 ${planned.length} 篇；加 --write 匯入，或 --check 比對網站。`);
