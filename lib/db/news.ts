import { Prisma, Status } from "@prisma/client";
import { prisma } from "../prisma";
import type {
  PublishedNewsFilters,
  AdminNewsFilters,
  PaginatedResult,
  CreateNewsInput,
  UpdateNewsInput,
  NewsWithRelations,
} from "../../types";

const defaultInclude = {
  author: { select: { id: true, email: true } },
  source: true,
  newsTags: { include: { tag: true } },
  images: true,
} as const;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/(-)+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

/**
 * Get published news with pagination, optional date range and source filter.
 */
export async function getPublishedNews(
  filters: PublishedNewsFilters = {},
): Promise<PaginatedResult<NewsWithRelations>> {
  try {
    const {
      page = 1,
      pageSize = 10,
      dateFrom,
      dateTo,
      sourceId,
      sourceSlug,
    } = filters;

    const where: Prisma.NewsWhereInput = {
      status: Status.PUBLISHED,
    };

    if (dateFrom ?? dateTo) {
      where.publishedDate = {};
      if (dateFrom) (where.publishedDate as { gte?: Date }).gte = dateFrom;
      if (dateTo) (where.publishedDate as { lte?: Date }).lte = dateTo;
    }

    if (sourceId) where.sourceId = sourceId;
    if (sourceSlug) where.source = { slug: sourceSlug };

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: defaultInclude,
        orderBy: { publishedDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.news.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("[getPublishedNews]", error);
    throw error;
  }
}

/**
 * Get news for admin listing with filters, all statuses.
 */
export async function getAdminNews(
  filters: AdminNewsFilters = {},
): Promise<PaginatedResult<NewsWithRelations>> {
  try {
    const {
      page = 1,
      pageSize = 20,
      search,
      status,
      sourceId,
      sortBy = "date",
      sortOrder = "desc",
    } = filters;

    const where: Prisma.NewsWhereInput = {};

    if (search?.trim()) {
      where.title = { contains: search.trim(), mode: "insensitive" };
    }
    if (status) where.status = status;
    if (sourceId) where.sourceId = sourceId;

    const orderBy =
      sortBy === "title"
        ? { title: sortOrder }
        : { publishedDate: sortOrder };

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: defaultInclude,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.news.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("[getAdminNews]", error);
    throw error;
  }
}

/**
 * Get a single news article by slug (any status).
 */
export async function getNewsBySlug(
  slug: string,
): Promise<NewsWithRelations | null> {
  try {
    const news = await prisma.news.findUnique({
      where: { slug },
      include: defaultInclude,
    });
    return news as NewsWithRelations | null;
  } catch (error) {
    console.error("[getNewsBySlug]", error);
    throw error;
  }
}

/**
 * Get a single news article by ID (any status).
 */
export async function getNewsById(
  id: string,
): Promise<NewsWithRelations | null> {
  try {
    const news = await prisma.news.findUnique({
      where: { id },
      include: defaultInclude,
    });
    return news as NewsWithRelations | null;
  } catch (error) {
    console.error("[getNewsById]", error);
    throw error;
  }
}

/**
 * Generate a unique slug from a title (appends suffix if needed).
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  try {
    const base = slugify(title);
    if (!base) return `news-${Date.now()}`;

    let slug = base;
    let suffix = 0;
    while (true) {
      const existing = await prisma.news.findUnique({ where: { slug } });
      if (!existing) return slug;
      suffix += 1;
      slug = `${base}-${suffix}`;
    }
  } catch (error) {
    console.error("[generateUniqueSlug]", error);
    throw error;
  }
}

/**
 * Create a news article with optional tags and images.
 */
export async function createNews(
  data: CreateNewsInput,
): Promise<NewsWithRelations> {
  try {
    const { tagIds, images, ...newsData } = data;
    const news = await prisma.$transaction(async (tx) => {
      const created = await tx.news.create({
        data: {
          ...newsData,
          newsTags: tagIds?.length
            ? { create: tagIds.map((tagId) => ({ tagId })) }
            : undefined,
          images: images?.length
            ? {
                create: images.map((img) => ({
                  url: img.url,
                  caption: img.caption ?? null,
                })),
              }
            : undefined,
        },
        include: defaultInclude,
      });
      return created;
    });
    return news as NewsWithRelations;
  } catch (error) {
    console.error("[createNews]", error);
    throw error;
  }
}

/**
 * Update a news article; tagIds replace existing tags; images replace existing NewsImages.
 */
export async function updateNews(
  id: string,
  data: UpdateNewsInput,
): Promise<NewsWithRelations> {
  try {
    const { tagIds, images, ...newsData } = data;
    const news = await prisma.$transaction(async (tx) => {
      if (tagIds !== undefined) {
        await tx.newsTag.deleteMany({ where: { newsId: id } });
      }
      if (images !== undefined) {
        await tx.newsImage.deleteMany({ where: { newsId: id } });
      }
      const updated = await tx.news.update({
        where: { id },
        data: {
          ...newsData,
          ...(tagIds?.length
            ? { newsTags: { create: tagIds.map((tagId) => ({ tagId })) } }
            : {}),
          ...(images?.length
            ? {
                images: {
                  create: images.map((img) => ({
                    url: img.url,
                    caption: img.caption ?? null,
                  })),
                },
              }
            : {}),
        },
        include: defaultInclude,
      });
      return updated;
    });
    return news as NewsWithRelations;
  } catch (error) {
    console.error("[updateNews]", error);
    throw error;
  }
}

/**
 * Delete a news article (cascades to NewsTag and NewsImage).
 */
export async function deleteNews(id: string): Promise<void> {
  try {
    await prisma.news.delete({ where: { id } });
  } catch (error) {
    console.error("[deleteNews]", error);
    throw error;
  }
}
