/**
 * URL param names for public news listing filters.
 * Keep in sync with DateFilter and SourceFilter.
 */
export const PARAM_DATE_FROM = "dateFrom";
export const PARAM_DATE_TO = "dateTo";
export const PARAM_SOURCES = "sources";
export const PARAM_PAGE = "page";

export function parseDateFromParams(searchParams: URLSearchParams): {
  dateFrom: string | null;
  dateTo: string | null;
} {
  const dateFrom = searchParams.get(PARAM_DATE_FROM);
  const dateTo = searchParams.get(PARAM_DATE_TO);
  return {
    dateFrom: dateFrom && isValidDateString(dateFrom) ? dateFrom : null,
    dateTo: dateTo && isValidDateString(dateTo) ? dateTo : null,
  };
}

export function parseSourcesFromParams(searchParams: URLSearchParams): string[] {
  const raw = searchParams.get(PARAM_SOURCES);
  if (!raw?.trim()) return [];
  return raw.split(",").map((id) => id.trim()).filter(Boolean);
}

export function parsePageFromParams(searchParams: URLSearchParams): number {
  const p = searchParams.get(PARAM_PAGE);
  const n = p ? parseInt(p, 10) : 1;
  return Number.isNaN(n) || n < 1 ? 1 : n;
}

function isValidDateString(s: string): boolean {
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

export function buildSearchParams(updates: {
  dateFrom?: string | null;
  dateTo?: string | null;
  sources?: string[] | null;
  page?: number | null;
  preserve?: URLSearchParams;
}): URLSearchParams {
  const params = new URLSearchParams(updates.preserve ?? undefined);
  if (updates.dateFrom !== undefined) {
    if (updates.dateFrom) params.set(PARAM_DATE_FROM, updates.dateFrom);
    else params.delete(PARAM_DATE_FROM);
  }
  if (updates.dateTo !== undefined) {
    if (updates.dateTo) params.set(PARAM_DATE_TO, updates.dateTo);
    else params.delete(PARAM_DATE_TO);
  }
  if (updates.sources !== undefined) {
    if (updates.sources?.length)
      params.set(PARAM_SOURCES, updates.sources.join(","));
    else params.delete(PARAM_SOURCES);
  }
  if (updates.page !== undefined) {
    if (updates.page != null && updates.page > 1)
      params.set(PARAM_PAGE, String(updates.page));
    else params.delete(PARAM_PAGE);
  }
  return params;
}
