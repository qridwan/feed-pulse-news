import { prisma } from "../prisma";
import type {
  CreateSourceInput,
  UpdateSourceInput,
  Source,
  AdminSourceFilters,
  SourceWithNewsCount,
  AdminSourceSortBy,
  AdminSourceSortOrder,
  PaginatedResult,
} from "../../types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/(-)+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 200);
}

/**
 * Generate a unique slug for a source from name (appends suffix if needed).
 */
export async function generateUniqueSourceSlug(name: string): Promise<string> {
  const base = slugify(name) || "source";
  let slug = base;
  let suffix = 1;
  for (;;) {
    const existing = await prisma.source.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

/**
 * Get sources for admin list with filters and pagination.
 */
export async function getAdminSources(
  filters: AdminSourceFilters
): Promise<PaginatedResult<SourceWithNewsCount>> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
  const search = (filters.search ?? "").trim();
  const activeFilter = filters.active;
  const sortBy: AdminSourceSortBy = filters.sortBy ?? "name";
  const sortOrder: AdminSourceSortOrder = filters.sortOrder ?? "asc";

  const where: { name?: { contains: string; mode: "insensitive" }; isActive?: boolean } = {};
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (activeFilter === "true") where.isActive = true;
  if (activeFilter === "false") where.isActive = false;

  const orderBy =
    sortBy === "newsCount"
      ? ({ news: { _count: sortOrder } } as const)
      : { name: sortOrder as "asc" | "desc" };

  const [items, total] = await Promise.all([
    prisma.source.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { news: true } } },
    }),
    prisma.source.count({ where }),
  ]);

  const withCount = items.map((s) => ({
    ...s,
    _count: s._count,
  })) as SourceWithNewsCount[];

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return {
    items: withCount,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Reassign all news from one source to another. Use before deleting a source that has news.
 */
export async function reassignNewsToSource(
  fromSourceId: string,
  toSourceId: string
): Promise<number> {
  if (fromSourceId === toSourceId) return 0;
  const result = await prisma.news.updateMany({
    where: { sourceId: fromSourceId },
    data: { sourceId: toSourceId },
  });
  return result.count;
}

/**
 * Get all sources, optionally only active ones.
 */
export async function getAllSources(activeOnly = true): Promise<Source[]> {
  try {
    const sources = await prisma.source.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { name: "asc" },
    });
    return sources;
  } catch (error) {
    console.error("[getAllSources]", error);
    throw error;
  }
}

/**
 * Get a source by ID.
 */
export async function getSourceById(id: string): Promise<Source | null> {
  try {
    const source = await prisma.source.findUnique({
      where: { id },
    });
    return source;
  } catch (error) {
    console.error("[getSourceById]", error);
    throw error;
  }
}

/**
 * Get a source by ID with news count (for API/admin).
 */
export async function getSourceByIdWithNewsCount(
  id: string
): Promise<SourceWithNewsCount | null> {
  try {
    const source = await prisma.source.findUnique({
      where: { id },
      include: { _count: { select: { news: true } } },
    });
    return source as SourceWithNewsCount | null;
  } catch (error) {
    console.error("[getSourceByIdWithNewsCount]", error);
    throw error;
  }
}

/**
 * Get a source by slug.
 */
export async function getSourceBySlug(slug: string): Promise<Source | null> {
  try {
    const source = await prisma.source.findUnique({
      where: { slug },
    });
    return source;
  } catch (error) {
    console.error("[getSourceBySlug]", error);
    throw error;
  }
}

/**
 * Create a new source.
 */
export async function createSource(data: CreateSourceInput): Promise<Source> {
  const slug = data.slug?.trim();
  if (!slug) {
    throw new Error("slug is required");
  }
  try {
    const source = await prisma.source.create({
      data: {
        name: data.name,
        slug,
        website: data.website,
        logoUrl: data.logoUrl ?? undefined,
        description: data.description ?? undefined,
        isActive: data.isActive ?? true,
      },
    });
    return source;
  } catch (error) {
    console.error("[createSource]", error);
    throw error;
  }
}

/**
 * Update a source by ID.
 */
export async function updateSource(
  id: string,
  data: UpdateSourceInput,
): Promise<Source> {
  try {
    const source = await prisma.source.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.website !== undefined && { website: data.website }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    return source;
  } catch (error) {
    console.error("[updateSource]", error);
    throw error;
  }
}

/**
 * Delete a source by ID. Fails if news articles reference it (Restrict).
 */
export async function deleteSource(id: string): Promise<void> {
  try {
    await prisma.source.delete({ where: { id } });
  } catch (error) {
    console.error("[deleteSource]", error);
    throw error;
  }
}
