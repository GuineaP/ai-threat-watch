import { getCollection, type CollectionEntry } from 'astro:content';

export type Case = CollectionEntry<'cases'>;
export const caseTitle = (entry: Case) => entry.data.title_zh || `${entry.data.id}｜中文案例名待編輯`;
export const statusLabel = (status: string) => ({ 'index-only': '僅有索引', placeholder: '導讀待編輯', draft: '編輯草稿', published: '已發布' }[status] || status);
export const directLabel = (value: boolean | 'unknown' | null | undefined) => value === true ? 'Yes｜直接相關' : value === false ? 'No｜無直接相關' : '未知｜待核對';
export const pagesLabel = (pages?: number[] | null) => pages?.length ? `原報告第 ${pages.join('、')} 頁` : '原報告頁碼待補';
export async function allCases() {
  const entries = await getCollection('cases');
  return entries.sort((a, b) => (a.data.report.pages?.[0] ?? Infinity) - (b.data.report.pages?.[0] ?? Infinity) || a.data.id.localeCompare(b.data.id));
}
export function counts(entries: Case[]) {
  return { main: entries.filter(e => e.data.case_unit === 'main').length, embedded: entries.filter(e => e.data.case_unit === 'embedded').length, indexed: entries.length, published: entries.filter(e => e.data.deep_dive && e.data.status === 'published').length };
}
