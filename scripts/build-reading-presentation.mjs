import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { config, siteRoot, editionRoot, loadEdition, bodyOfArticle, stripFrontmatter, presentationProfile, saveOrCheck } from './edition-utils.mjs';
const index = await loadEdition();
const entries = [];
for (const row of index.articles) {
  const text = await readFile(path.join(editionRoot, row.file), 'utf8');
  entries.push(presentationProfile(row.id, 'case', bodyOfArticle(text)));
}
const guideDir = path.join(siteRoot, 'src/content/guides');
for (const file of (await readdir(guideDir)).filter(file => file.endsWith('.md')).sort()) {
  const body = stripFrontmatter(await readFile(path.join(guideDir, file), 'utf8'));
  entries.push(presentationProfile(file.slice(0, -3), 'guide', body));
}
assert.equal(new Set(entries.map(entry => entry.lead.replace(/\s+/g, ' ').trim())).size, entries.length, '導語重複，無法可靠比對呈現設定');
await saveOrCheck('scripts/reading-presentation.json', { updated_at: config.edition, title: '給台灣讀者的啟發', entries });
console.log(`已核對 ${entries.length} 篇呈現設定；其中 ${entries.filter(e => e.kind === 'case' && e.editorial).length} 篇案例含編者區塊。`);
