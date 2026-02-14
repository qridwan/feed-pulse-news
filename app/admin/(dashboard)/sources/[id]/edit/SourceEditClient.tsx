"use client";

import { useRouter } from "next/navigation";
import { SourceForm } from "@/components/admin/SourceForm";
import { updateAdminSource } from "@/lib/api/admin-sources-client";
import type { SourceFormData } from "@/lib/admin/source-form-schema";

export interface SourceEditClientProps {
  editId: string;
  defaultValues: Partial<SourceFormData>;
}

export function SourceEditClient({ editId, defaultValues }: SourceEditClientProps) {
  const router = useRouter();

  async function handleUpdate(id: string, data: SourceFormData) {
    await updateAdminSource(id, {
      name: data.name,
      slug: data.slug ?? undefined,
      website: data.website ?? "",
      logoUrl: data.logoUrl ?? null,
      description: data.description ?? null,
      isActive: data.isActive,
    });
    router.push("/admin/sources?saved=1");
  }

  return (
    <SourceForm
      defaultValues={defaultValues}
      editId={editId}
      updateAction={handleUpdate}
      submitLabel="Save"
      cancelHref="/admin/sources"
    />
  );
}
