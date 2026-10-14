// Emphasis is authored and evidence-reviewed in the edition. Never rewrite prose here.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { editionRoot, loadEdition, saveOrCheck } from './edition-utils.mjs';
const index = await loadEdition();
const selections = {};
for (const row of index.articles) {
  const text = await readFile(path.join(editionRoot, row.file), 'utf8');
  selections[row.id] = [...text.matchAll(/\*\*([^*]+)\*\*/g)].map(match => match[1]);
}
await saveOrCheck('scripts/capability-keypoints.json', selections);
console.log(`已記錄 ${index.articles.length} 篇實際粗體選句；不限定每篇數量，不改寫文章。`);
