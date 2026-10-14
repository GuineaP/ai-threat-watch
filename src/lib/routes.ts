export function href(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
export const reportHref = (id: string) => href(`/reports/${id}/`);
export const caseHref = (report: string, slug: string) => href(`/reports/${report}/cases/${slug}/`);
