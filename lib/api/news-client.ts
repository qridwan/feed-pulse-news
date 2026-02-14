/**
 * Client-side fetchers for the public news API.
 */

export interface NewsListQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  source?: string;
  sources?: string;
  tag?: string;
}

export interface NewsListResponse {
  items: NewsListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NewsListItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  publishedDate: string;
  thumbnailUrl: string | null;
  source: { id: string; name: string; slug: string; logoUrl: string | null };
  [key: string]: unknown;
}

export interface NewsDetailResponse extends NewsListItem {
  fullContent: string;
  newsLink: string | null;
  views: number;
  newsTags: { tag: { id: string; name: string; slug: string } }[];
  images?: { id: string; url: string; caption: string | null }[];
  [key: string]: unknown;
}

function buildQueryString(query: NewsListQuery): string {
  const params = new URLSearchParams();
  if (query.page != null) params.set("page", String(query.page));
  if (query.limit != null) params.set("limit", String(query.limit));
  if (query.startDate) params.set("startDate", query.startDate);
  if (query.endDate) params.set("endDate", query.endDate);
  if (query.source) params.set("source", query.source);
  if (query.sources) params.set("sources", query.sources);
  if (query.tag) params.set("tag", query.tag);
  const q = params.toString();
  return q ? `?${q}` : "";
}

export async function fetchNewsList(
  query: NewsListQuery = {}
): Promise<NewsListResponse> {
  const res = await fetch(`/api/news${buildQueryString(query)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Failed to fetch news (${res.status})`);
  }
  return res.json();
}

export async function fetchNewsBySlug(slug: string): Promise<NewsDetailResponse | null> {
  const res = await fetch(`/api/news/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Failed to fetch article (${res.status})`);
  }
  return res.json();
}
