import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { parseFrontmatter } from 'astro/markdown';
import { config, editionRoot } from './edition-utils.mjs';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';

const plainRenderer = await createMarkdownProcessor({ smartypants: false, syntaxHighlight: false });
const visibleText = html => html.replace(/<[^>]*>/g, '').replace(/&(?:amp|lt|gt|quot|apos|#39|#x([0-9a-f]+)|#([0-9]+));/gi, (entity, hex, decimal) => hex ? String.fromCodePoint(parseInt(hex, 16)) : decimal ? String.fromCodePoint(Number(decimal)) : ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&#39;': "'" }[entity] ?? entity)).replace(/\s+/g, '');
async function verifyRenderedProse(body, html, id) {
  const expected = (await plainRenderer.render(body)).code;
  const actual = visibleText(html);
  for (const block of expected.matchAll(/<(p|h2|h3|li)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    assert.ok(actual.includes(visibleText(block[2])), `呈現後遺漏或改寫已複核文字：${id}：${visibleText(block[2]).slice(0, 36)}`);
  }
}

async function files(dir) {
  const result = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    result.push(...(item.isDirectory() ? await files(full) : [full]));
  }
  return result;
}
async function metadata(file) {
  const text = await readFile(file, 'utf8');
  return parseFrontmatter(text).frontmatter;
}
const caseFiles = (await files('src/content/cases')).filter(f => /\.mdx?$/.test(f));
const cases = await Promise.all(caseFiles.map(metadata));
const reports = await Promise.all((await files('src/content/reports')).map(metadata));
const topicIds = new Set((await Promise.all((await files('src/content/topics')).map(metadata))).map(t => t.slug));
assert.equal(new Set(cases.map(c => `${c.report.report_id}/${c.id}`)).size, cases.length, '案例 ID 重複');
assert.equal(new Set(cases.map(c => `${c.report.report_id}/${c.slug}`)).size, cases.length, '案例 route 重複');
for (const report of reports) {
  const entries = cases.filter(c => c.report.report_id === report.report_id);
  assert.equal(entries.filter(c => c.case_unit === 'main').length, report.main_case_count, '主要案例數不一致');
  assert.equal(entries.filter(c => c.case_unit === 'embedded').length, report.embedded_case_count, '補充案例數不一致');
  for (const section of report.sections) {
    assert.equal(entries.filter(c => c.case_unit === 'main' && c.report.section === section.title_en).length, section.main_case_count, `章節數量不一致：${section.title_en}`);
  }
}
for (const entry of cases) {
  const report = reports.find(r => r.report_id === entry.report.report_id);
  assert.ok(report, '案例引用不存在的報告');
  assert.ok(report.sections.some(s => s.title_en === entry.report.section), '案例章節不存在');
  assert.ok(entry.report.pages?.every(p => p > 0 && p <= report.pdf_page_count), '案例頁碼超出報告');
  entry.topics.forEach(topic => assert.ok(topicIds.has(topic), `主題不存在：${topic}`));
  assert.ok(!entry.deep_dive || entry.status === 'published', '待編輯模板不能標為已有完整導讀');
  if (entry.source_group) assert.ok(cases.some(c => c.id !== entry.id && c.source_group === entry.source_group), '共用標題的案例關係缺失');
}
const initial = cases.filter(c => c.report.report_id === 'anthropic-2026-09');
const selected = ['GTG-20006','GTG-10007','GTG-84005','GTG-34001','GTG-84006','GTG-14010','GTG-14020','GTG-14021','GTG-14022'].sort();
assert.deepEqual(initial.filter(c => c.selected_for_deep_dive).map(c => c.id).sort(), selected, '九個編輯選案被改變');
assert.equal(initial.find(c => c.id === 'GTG-50021')?.case_unit, 'embedded');
assert.equal(initial.find(c => c.id === 'GTG-16012')?.source_group, initial.find(c => c.id === 'GTG-16003')?.source_group);

const outputDir = process.env.OUTPUT_DIR || 'dist';
const outputFiles = await files(outputDir);
const outputSet = new Set(outputFiles.map(f => path.resolve(f)));
assert.equal(outputFiles.filter(f=>f.endsWith('.html')).length,68,'應建置68頁');
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = (process.env.BASE_PATH || (repositoryName ? `/${repositoryName}/` : '/')).replace(/\/$/, '');
assert.ok(!outputFiles.some(f => /\.pdf$/i.test(f)), '靜態輸出不可包含原 PDF');
let checkedLinks = 0;
for (const file of outputFiles.filter(f => f.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  assert.match(html, /lang="zh-Hant-TW"/, '缺少繁中頁面語言');
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${file} 應有一個主要標題`);
  for (const match of html.matchAll(/(?:href|src)="([^"\s]+)"/g)) {
    const url = match[1];
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    assert.ok(!base || url === base || url.startsWith(base + '/'), `連結沒有帶入部署子路徑：${url}`);
    const relative = decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]).replace(/^\//, '');
    const candidates = [relative, path.join(relative, 'index.html')].map(f => path.resolve(outputDir, f));
    assert.ok(candidates.some(f => outputSet.has(f)), `失效的本機連結：${url}（${file}）`);
    checkedLinks++;
  }
}
const editionDir = editionRoot;
const edition = JSON.parse(await readFile('scripts/article-provenance.json','utf8'));
for (const row of edition.articles) {
  const entry = cases.find(c=>c.slug===row.id);
  assert.ok(entry,'新版條目缺失');
  const siteText = await readFile(caseFiles.find(f=>path.basename(f)===row.id+'.md'),'utf8');
  const siteBody = siteText.replace(/^---\s*\n[\s\S]*?\n---\s*\n/,'').trim();
  assert.equal(createHash('sha256').update(siteBody).digest('hex'),row.body_sha256,`網站正文與複核版不同：${row.id}`);
  const original=await readFile(path.join(editionDir,'articles',row.id+'.md'),'utf8');
  assert.equal(createHash('sha256').update(original).digest('hex'),row.full_sha256,'新版完整檔案被更改');
  assert.equal(createHash('sha256').update(siteText).digest('hex'),row.site_sha256,`網站全文或屬性不同：${row.id}`);
  assert.equal(entry.updated_at,config.edition,'網站修訂日期不同');
  assert.equal(entry.title_zh,row.title,'標題與複核版不同');
  assert.deepEqual(entry.report.pages,row.pages,'頁序與來源版不同');
  assert.ok(entry.summary_zh?.length && entry.updated_at,'缺少卡片摘要或修訂日期');
  const html = await readFile(`${outputDir}/reports/${entry.report.report_id}/cases/${entry.slug}/index.html`,'utf8');
  await verifyRenderedProse(siteBody, html, row.id);
  assert.match(html,/class="case-lead"/,'導語未呈現');
  assert.match(html,/class="reading-toc"/,'實際小標目錄未呈現');
  assert.match(html,/class="article-sources"/,'來源正文未呈現');
  assert.ok(!html.includes('待編輯模板'),'舊模板殘留');
  assert.ok(html.indexOf('class="case-lead"')<html.indexOf('class="reading-toc"'),'目錄搶在事件前');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for (const m of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(m[1]),`目錄錨點不存在：${m[1]}`);
}
const guides=await Promise.all((await files('src/content/guides')).map(metadata));
assert.equal(guides.length,4,'四條導讀缺失');
for(const guide of guides) {
  assert.equal(guide.cases.length,3,'各條導讀須有三篇對照');
  for(const slug of guide.cases)assert.ok(cases.some(c=>c.slug===slug),'導讀引用未知案例');
}
const presentation=JSON.parse(await readFile('scripts/reading-presentation.json','utf8'));
assert.equal(presentation.updated_at,config.edition,'呈現設定版本不同');
assert.equal(presentation.entries.length,48,'案例與導讀呈現設定不完整');
for(const profile of presentation.entries){
  const location=profile.kind==='case'?'reports/anthropic-2026-09/cases/'+profile.id:'guides/'+profile.id;
  const html=await readFile(`${outputDir}/${location}/index.html`,'utf8');
  if (profile.kind === 'guide') {
    const source = await readFile(`src/content/guides/${profile.id}.md`, 'utf8');
    await verifyRenderedProse(source.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, ''), html, profile.id);
  }
  const count=(html.match(/class="reading-highlight"/g)||[]).length;
  assert.equal(count,profile.keypoint_count,`精選提醒未全部呈現或重複：${profile.id}`);
  if(profile.editorial){
    assert.equal((html.match(/class="editor-observation"/g)||[]).length,1,`編者區塊缺失或重複：${profile.id}`);
    assert.match(html,/class="editorial-label"/,'編者視角標示缺失');
    if(profile.editorial.subtitle)assert.ok(html.includes(profile.editorial.subtitle),'核准的白話小標未呈現');
    assert.ok(html.includes(presentation.title),'統一標題缺失');
    if(profile.kind==='case')assert.ok(html.indexOf('class="editor-observation"')<html.indexOf('class="article-sources"'),'編者延伸應在來源附錄之前');
  }else assert.ok(!html.includes('class="editor-observation"'),`不應新增未提供的台灣觀點：${profile.id}`);
}
console.log(`Verified ${cases.length} cases, exact revised prose and hashes, four guides, report counts, relationships, reading anchors, and ${checkedLinks} internal links/assets.`);
console.log('Verified '+presentation.entries.filter(e=>e.kind==='case'&&e.editorial).length+' authored Taiwan sections, four guides, and '+presentation.entries.reduce((sum,e)=>sum+e.keypoint_count,0)+' authored highlights.');
