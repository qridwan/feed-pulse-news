import { prisma } from "../prisma";
import type { CreateSourceInput, UpdateSourceInput, Source } from "../../types";

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
  try {
    const source = await prisma.source.create({
      data: {
        name: data.name,
        slug: data.slug,
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
