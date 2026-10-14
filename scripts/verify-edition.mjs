import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { config, siteRoot, editionRoot, loadEdition, sha256, readJSON } from './edition-utils.mjs';
import { parseFrontmatter } from 'astro/markdown';

const index = await loadEdition();
const baseline = await readJSON(new URL('./routing-baseline.json', import.meta.url));
const coverage = await readJSON(path.join(editionRoot, 'coverage-record.json'));
assert.equal(coverage.cases.length, config.article_count, '複核紀錄未涵蓋 44 篇');
assert.equal(new Set(coverage.cases.map(row => row.id)).size, config.article_count, '複核紀錄 ID 重複');
for (const row of index.articles) {
  const record = coverage.cases.find(item => item.id === row.id);
  assert.ok(record?.copyedit_complete && record?.evidence_review_complete, `缺少兩階段審稿紀錄：${row.id}`);
  assert.ok(record.pdf_pages_read.length, `未記錄來源頁序：${row.id}`);
  const article = await readFile(path.join(editionRoot, row.file), 'utf8');
  for (const match of article.matchAll(/第\s*(\d+)(?:\s*[–—\-－]\s*(\d+))?\s*頁/g)) {
    const end = Number(match[2] || match[1]);
    assert.ok(end >= Number(match[1]), `頁序範圍倒置：${row.id}`);
    for (let page = Number(match[1]); page <= end; page++) assert.ok(row.pdf_file_pages.includes(page), `正文引頁未列入來源索引：${row.id} 第${page}頁`);
  }
  const siteText = await readFile(path.join(siteRoot, 'src/content/cases', config.report_id, row.id + '.md'), 'utf8');
  const data = parseFrontmatter(siteText).frontmatter;
  const relation = Object.fromEntries(['id', 'slug', 'source_id', 'case_unit', 'source_group', 'selected_for_deep_dive'].map(key => [key, data[key] ?? null]));
  relation.report_id = data.report.report_id;
  assert.deepEqual(relation, baseline[row.id], `原有案例身分或來源關係被改動：${row.id}`);
  assert.deepEqual(data.sources[0].pages, row.pdf_file_pages, `来源節的頁碼不同：${row.id}`);
}
const support = await readJSON(path.join(editionRoot, 'supporting-pages.json'));
for (const row of support.files) assert.equal(sha256(await readFile(path.join(siteRoot, row.path))), row.sha256, `導讀或首頁與複核版不同：${row.path}`);
const mirror = path.resolve(siteRoot, config.workspace_mirror);
let localMirror = false;
try { await access(mirror); localMirror = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
if (localMirror) {
  const mirrorIndex = await readFile(path.join(mirror, 'article-index.json'), 'utf8');
  assert.equal(mirrorIndex, await readFile(path.join(editionRoot, 'article-index.json'), 'utf8'), '本機修訂索引與網站封存版不同');
  for (const row of index.articles) assert.equal(sha256(await readFile(path.join(mirror, row.file))), row.sha256, `本機修訂稿與網站封存版不同：${row.id}`);
  const originals = await readJSON(path.join(mirror, 'backups/original-input-sha256.json'));
  for (const [file, hash] of Object.entries(originals)) assert.equal(sha256(await readFile(path.resolve(siteRoot, '..', file))), hash, `原始材料被改動：${file}`);
  console.log(`另核對本機修訂稿，以及 ${Object.keys(originals).length} 份原始材料未改動。`);
} else console.log('此環境無工作區原始材料；已核對 repository 內封存版，未重讀來源 PDF。');
console.log(`Verified ${index.articles.length} edition records, citation pages, preserved routes/relationships, and ${support.files.length} reviewed supporting pages. Source fidelity is documented editorial work, not established by this automated check.`);
