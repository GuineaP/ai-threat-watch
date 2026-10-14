import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { presentationProfile } from './edition-utils.mjs';
import readingLayout from './reading-layout.mjs';

test('authored emphasis may contain zero, one, or three selections', () => {
  for (const count of [0, 1, 3]) {
    const body = '這是導語。\n\n' + Array.from({ length: count }, (_, i) => `**第${i + 1}個重點。**`).join('\n\n');
    assert.equal(presentationProfile('sample', 'case', body).keypoint_count, count);
  }
  assert.throws(() => presentationProfile('sample', 'case', '導語。\n\n**未閉合的粗體'), /粗體標記未配對/);
});
test('editorial blocks must identify the editor and may not repeat', () => {
  assert.throws(() => presentationProfile('sample', 'case', '導語。\n\n## 給台灣讀者的啟發\n\n未說明誰的觀點。'), /未交代/);
  const section = '\n\n## 給台灣讀者的啟發\n\n以下是編者的情境推演。';
  assert.throws(() => presentationProfile('sample', 'case', '導語。' + section + section), /重複編者區塊/);
});
test('presentation preserves the reviewed editorial attribution and prose', async () => {
  const presentation = JSON.parse(await readFile(new URL('./reading-presentation.json', import.meta.url), 'utf8'));
  const profile = presentation.entries.find(row => row.kind === 'case' && row.editorial);
  const t = value => ({ type: 'text', value });
  const e = (tagName, children) => ({ type: 'element', tagName, properties: {}, children });
  const exact = '以下是編者的情境推演。若採用類似方法，應分開來源事實與推論。';
  const tree = { type: 'root', children: [e('p', [t(profile.lead)]), e('h2', [t('給台灣讀者的啟發')]), e('p', [t(exact)]), e('h2', [t('查證與來源')]), e('p', [t('來源頁碼。')])] };
  readingLayout()(tree);
  const values = node => node.type === 'text' ? node.value : (node.children || []).map(values).join('');
  assert.ok(values(tree).includes(exact), '呈現層不得刪除或改寫已複核段落');
  const sections = tree.children.filter(node => node.properties?.className?.includes('editor-observation'));
  assert.equal(sections.length, 1);
  assert.ok(values(sections[0]).includes('編者觀點'));
});
