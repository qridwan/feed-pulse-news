"use client";

import { NewsForm } from "@/components/admin/NewsForm";
import { createNewsAction } from "../actions";
import type { NewsFormData } from "@/lib/admin/news-form-schema";
import type { Source, Tag } from "@prisma/client";

export function NewsFormClient({
  sources,
  tags,
  defaultValues,
}: {
  sources: Source[];
  tags: Tag[];
  defaultValues: Partial<NewsFormData>;
}) {
  async function onSubmit(data: NewsFormData) {
    await createNewsAction(data);
  }

  return (
    <NewsForm
      sources={sources}
      tags={tags}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitLabel="Create article"
    />
  );
}
