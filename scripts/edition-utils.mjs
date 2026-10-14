import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

export const siteRoot = fileURLToPath(new URL('../', import.meta.url));
export const config = JSON.parse(await readFile(new URL('./edition-config.json', import.meta.url), 'utf8'));
export const editionRoot = path.resolve(siteRoot, config.directory);
export const sha256 = text => createHash('sha256').update(text).digest('hex');
export const bodyOfArticle = text => text.trim().split('\n').slice(2).join('\n').trim();
export const stripFrontmatter = text => text.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '').trim();
export const readJSON = async file => JSON.parse(await readFile(file, 'utf8'));
export async function loadEdition() {
  const index = await readJSON(path.join(editionRoot, 'article-index.json'));
  assert.equal(index.edition, config.edition, '匯入版本與目前複核版本不同');
  assert.equal(index.source_sha256, config.source_sha256, '來源 PDF 版本不同');
  assert.equal(index.articles.length, config.article_count, '複核版必須完整涵蓋 44 篇');
  assert.equal(new Set(index.articles.map(row => row.id)).size, config.article_count, '案例 ID 重複');
  for (const row of index.articles) {
    assert.equal(row.file, `articles/${row.id}.md`, '文章路徑不符');
    const text = await readFile(path.join(editionRoot, row.file), 'utf8');
    assert.equal(sha256(text), row.sha256, `複核文章雜湊不同：${row.id}`);
    const [heading, idLine] = text.split('\n');
    assert.equal(heading, `# ${row.title}`, `文章標題不同：${row.id}`);
    assert.ok(idLine.startsWith(`${row.display_id}｜`), `文章 ID 不符：${row.id}`);
    assert.equal(row.revision_date, config.edition, `修訂日期不同：${row.id}`);
    assert.ok(row.pdf_file_pages.length && row.pdf_file_pages.every(p => Number.isInteger(p) && p > 0 && p <= config.pdf_page_count), `來源頁序不合法：${row.id}`);
    assert.ok(text.includes('## 查證與來源'), `缺少來源節：${row.id}`);
    assert.ok(text.includes(`編輯修訂：${config.edition}。`), `缺少本文修訂日期：${row.id}`);
  }
  return index;
}
export async function saveOrCheck(relative, value) {
  const target = path.join(siteRoot, relative);
  const text = JSON.stringify(value, null, 2) + '\n';
  if (process.argv.includes('--check')) assert.equal(await readFile(target, 'utf8'), text, `衍生設定過期，請重新產生：${relative}`);
  else await writeFile(target, text);
}
export function presentationProfile(id, kind, body) {
  const lead = body.trim().split(/\n\s*\n/)[0].replace(/\*\*/g, '');
  const markers = (body.match(/\*\*/g) || []).length;
  assert.equal(markers % 2, 0, `粗體標記未配對：${id}`);
  const entry = { id, kind, lead, keypoint_count: markers / 2, body_sha256: sha256(body) };
  const sections = [...body.matchAll(/^## 給台灣讀者的啟發\s*\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)];
  assert.ok(sections.length <= 1, `重複編者區塊：${id}`);
  if (sections.length) {
    assert.ok(/編者/.test(sections[0][1]), `編者區塊未交代觀點來源：${id}`);
    const mode = sections[0][1].includes('情境推演') ? '情境推演' : sections[0][1].includes('案例類比') ? '案例類比' : '延伸解讀';
    entry.editorial = { heading: '給台灣讀者的啟發', mode };
  }
  return entry;
}
