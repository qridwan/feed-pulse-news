import type { News, Source, Tag, Status } from "@prisma/client";

// Re-export Prisma enums and model types for convenience
export type { News, Source, Tag, Status };

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export interface PublishedNewsFilters {
  page?: number;
  pageSize?: number;
  dateFrom?: Date;
  dateTo?: Date;
  sourceId?: string;
  sourceSlug?: string;
}

export type AdminNewsSortBy = "date" | "title";
export type AdminNewsSortOrder = "asc" | "desc";

export interface AdminNewsFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: Status;
  sourceId?: string;
  sortBy?: AdminNewsSortBy;
  sortOrder?: AdminNewsSortOrder;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateNewsInput {
  title: string;
  slug: string;
  publishedDate: Date;
  newsLink?: string | null;
  shortDescription: string;
  fullContent: string;
  thumbnailUrl?: string | null;
  status?: Status;
  authorId: string;
  sourceId: string;
  tagIds?: string[];
  images?: { url: string; caption?: string | null }[];
}

export interface UpdateNewsInput {
  title?: string;
  slug?: string;
  publishedDate?: Date;
  newsLink?: string | null;
  shortDescription?: string;
  fullContent?: string;
  thumbnailUrl?: string | null;
  status?: Status;
  sourceId?: string;
  tagIds?: string[];
  images?: { url: string; caption?: string | null }[];
}

export type NewsWithRelations = News & {
  author: { id: string; email: string };
  source: Source;
  newsTags: { tag: Tag }[];
  images?: { id: string; url: string; caption: string | null }[];
};

// ---------------------------------------------------------------------------
// Source
// ---------------------------------------------------------------------------

export interface CreateSourceInput {
  name: string;
  slug: string;
  website: string;
  logoUrl?: string | null;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateSourceInput {
  name?: string;
  slug?: string;
  website?: string;
  logoUrl?: string | null;
  description?: string | null;
  isActive?: boolean;
}

// ---------------------------------------------------------------------------
// Tag
// ---------------------------------------------------------------------------

export interface CreateTagInput {
  name: string;
  slug: string;
}

export type TagWithRelation = Tag & { newsTags?: { newsId: string }[] };
