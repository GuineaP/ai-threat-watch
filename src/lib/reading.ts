import type { Case } from './content';

export const reportId = 'anthropic-2026-09';
export const readingTopics = [
  { value: 'influence', label: '資訊操作' },
  { value: 'surveillance', label: '人物資料與監控' },
  { value: 'cyber', label: '網路入侵' },
  { value: 'research', label: '武器與研究' },
  { value: 'services', label: 'AI 服務與資料' },
];
export function readingTopic(entry: Case) {
  const section = entry.data.report.section;
  const value = section === 'Influence operations' ? 'influence' : section === 'Surveillance operations' ? 'surveillance' : section === 'Cyber operations' ? 'cyber' : ['Conventional weapons', 'Biological misuse'].includes(section) ? 'research' : 'services';
  return readingTopics.find(t => t.value === value)!;
}
export const guideHref = (slug: string) => `/guides/${slug}/`;
