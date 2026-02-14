"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import {
  createNews,
  deleteNews,
  generateUniqueSlug,
  updateNews,
} from "@/lib/db/news";
import type { NewsFormData } from "@/lib/admin/news-form-schema";
import type { Status } from "@prisma/client";

export async function deleteNewsAction(id: string) {
  await deleteNews(id);
  revalidatePath("/admin/news");
}

export async function createNewsAction(data: NewsFormData) {
  const user = await requireAuth();
  const slug = await generateUniqueSlug(data.title);
  const additionalUrls = data.additionalImages
    ? data.additionalImages.split(",").filter(Boolean)
    : [];
  await createNews({
    title: data.title,
    slug,
    publishedDate: new Date(data.publishedDate),
    newsLink: data.newsLink ?? null,
    shortDescription: data.shortDescription,
    fullContent: data.fullContent,
    thumbnailUrl: data.thumbnailUrl ?? null,
    status: data.status as Status,
    authorId: user.id,
    sourceId: data.sourceId,
    tagIds: data.tagIds?.length ? data.tagIds : undefined,
    images:
      additionalUrls.length > 0
        ? additionalUrls.map((url) => ({ url }))
        : undefined,
  });
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function updateNewsAction(id: string, data: NewsFormData) {
  await requireAuth();
  const additionalUrls = data.additionalImages
    ? data.additionalImages.split(",").filter(Boolean)
    : [];
  await updateNews(id, {
    title: data.title,
    publishedDate: new Date(data.publishedDate),
    newsLink: data.newsLink ?? null,
    shortDescription: data.shortDescription,
    fullContent: data.fullContent,
    thumbnailUrl: data.thumbnailUrl ?? null,
    status: data.status as Status,
    sourceId: data.sourceId,
    tagIds: data.tagIds?.length ? data.tagIds : undefined,
    images:
      additionalUrls.length > 0
        ? additionalUrls.map((url) => ({ url }))
        : undefined,
  });
  revalidatePath("/admin/news");
  redirect("/admin/news");
}
