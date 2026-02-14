"use client";

import { useRouter } from "next/navigation";
import { SourceForm } from "@/components/admin/SourceForm";
import { createAdminSource } from "@/lib/api/admin-sources-client";
import type { SourceFormData } from "@/lib/admin/source-form-schema";

export function SourceCreateClient() {
  const router = useRouter();

  async function handleSubmit(data: SourceFormData) {
    await createAdminSource({
      name: data.name,
      slug: data.slug ?? undefined,
      website: data.website ?? "",
      logoUrl: data.logoUrl ?? null,
      description: data.description ?? null,
      isActive: data.isActive,
    });
    router.push("/admin/sources?created=1");
  }

  return (
    <SourceForm
      onSubmit={handleSubmit}
      submitLabel="Create"
      cancelHref="/admin/sources"
    />
  );
}
