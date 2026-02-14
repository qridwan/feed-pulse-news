/**
 * Client for admin source APIs. Use from admin dashboard (browser).
 * Sends credentials so the session cookie is included.
 */

export interface AdminSourcesQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: string;
  sortBy?: "name" | "newsCount";
  sortOrder?: "asc" | "desc";
}

export interface SourceWithNewsCount {
  id: string;
  name: string;
  slug: string;
  website: string;
  logoUrl: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: { news: number };
}

export interface AdminSourcesResponse {
  items: SourceWithNewsCount[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateSourcePayload {
  name: string;
  slug?: string;
  website?: string;
  logoUrl?: string | null;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateSourcePayload {
  name?: string;
  slug?: string;
  website?: string;
  logoUrl?: string | null;
  description?: string | null;
  isActive?: boolean;
}

const credentials: RequestCredentials = "include";

function buildQuery(params: AdminSourcesQuery): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set("page", String(params.page));
  if (params.pageSize != null) searchParams.set("pageSize", String(params.pageSize));
  if (params.search) searchParams.set("search", params.search);
  if (params.active) searchParams.set("active", params.active);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  const q = searchParams.toString();
  return q ? `?${q}` : "";
}

export async function fetchAdminSources(
  params: AdminSourcesQuery = {}
): Promise<AdminSourcesResponse> {
  const res = await fetch(`/api/admin/sources${buildQuery(params)}`, {
    method: "GET",
    credentials,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? "Failed to fetch sources");
  }
  return res.json();
}

export async function fetchAdminSource(id: string): Promise<SourceWithNewsCount | null> {
  const res = await fetch(`/api/admin/sources/${encodeURIComponent(id)}`, {
    method: "GET",
    credentials,
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? "Failed to fetch source");
  }
  return res.json();
}

export interface Source {
  id: string;
  name: string;
  slug: string;
  website: string;
  logoUrl: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function createAdminSource(data: CreateSourcePayload): Promise<Source> {
  const res = await fetch("/api/admin/sources", {
    method: "POST",
    credentials,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: data.name,
      slug: data.slug ?? undefined,
      website: data.website ?? "",
      logoUrl: data.logoUrl ?? null,
      description: data.description ?? null,
      isActive: data.isActive ?? true,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { error?: string }).error ?? "Failed to create source");
  }
  return body as Source;
}

export async function updateAdminSource(
  id: string,
  data: UpdateSourcePayload
): Promise<Source> {
  const res = await fetch(`/api/admin/sources/${encodeURIComponent(id)}`, {
    method: "PUT",
    credentials,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.website !== undefined && { website: data.website }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { error?: string }).error ?? "Failed to update source");
  }
  return body as Source;
}

export async function deleteAdminSource(id: string): Promise<void> {
  const res = await fetch(`/api/admin/sources/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials,
  });
  if (res.status === 204) return;
  const body = await res.json().catch(() => ({}));
  const err = body as { error?: string; message?: string };
  throw new Error(err.message ?? err.error ?? "Failed to delete source");
}
