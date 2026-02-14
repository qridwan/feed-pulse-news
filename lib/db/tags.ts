import { prisma } from "../prisma";
import type { Tag } from "../../types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/(-)+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

/**
 * Get all tags.
 */
export async function getAllTags(): Promise<Tag[]> {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    });
    return tags;
  } catch (error) {
    console.error("[getAllTags]", error);
    throw error;
  }
}

/**
 * Get tags for a news article by news ID.
 */
export async function getTagsByNewsId(newsId: string): Promise<Tag[]> {
  try {
    const newsTags = await prisma.newsTag.findMany({
      where: { newsId },
      include: { tag: true },
    });
    return newsTags.map((nt) => nt.tag);
  } catch (error) {
    console.error("[getTagsByNewsId]", error);
    throw error;
  }
}

/**
 * Get or create tags by name; returns tags in the same order as names.
 * Creates missing tags with slug derived from name.
 */
export async function getOrCreateTags(names: string[]): Promise<Tag[]> {
  if (names.length === 0) return [];

  try {
    const normalized = [...new Set(names)].filter(Boolean);
    const result: Tag[] = [];

    for (const name of normalized) {
      const slug =
        slugify(name) ||
        `tag-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const tag = await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      });
      result.push(tag);
    }

    const bySlug = new Map(result.map((t) => [t.slug, t]));
    return names.map((name) => {
      const slug = slugify(name);
      const tag = bySlug.get(slug);
      if (!tag) throw new Error(`Tag not found for name: ${name}`);
      return tag;
    });
  } catch (error) {
    console.error("[getOrCreateTags]", error);
    throw error;
  }
}
