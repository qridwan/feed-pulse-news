"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import {
  createSource,
  updateSource,
  deleteSource,
  reassignNewsToSource,
  getSourceById,
  generateUniqueSourceSlug,
} from "@/lib/db/sources";
import type { SourceFormData } from "@/lib/admin/source-form-schema";

export async function toggleSourceActiveAction(id: string, isActive: boolean) {
  await requireAuth();
  await updateSource(id, { isActive });
  revalidatePath("/admin/sources");
}

export async function deleteSourceAction(
  id: string,
  reassignToId?: string
) {
  await requireAuth();
  if (reassignToId) {
    await reassignNewsToSource(id, reassignToId);
  }
  await deleteSource(id);
  revalidatePath("/admin/sources");
}

export async function createSourceFromFormAction(data: SourceFormData) {
  await requireAuth();
  const slug = data.slug?.trim() || (await generateUniqueSourceSlug(data.name));
  await createSource({
    name: data.name,
    slug,
    website: data.website?.trim() ?? "",
    logoUrl: data.logoUrl ?? null,
    description: data.description ?? null,
    isActive: data.isActive,
  });
  revalidatePath("/admin/sources");
  redirect("/admin/sources?created=1");
}

export async function updateSourceFromFormAction(id: string, data: SourceFormData) {
  await requireAuth();
  await updateSource(id, {
    name: data.name,
    slug: data.slug?.trim() || undefined,
    website: data.website?.trim() ?? "",
    logoUrl: data.logoUrl ?? null,
    description: data.description ?? null,
    isActive: data.isActive,
  });
  revalidatePath("/admin/sources");
  redirect("/admin/sources?saved=1");
}

export async function getSourceForEdit(id: string) {
  await requireAuth();
  return getSourceById(id);
}
