"use client";

import { NewsForm } from "@/components/admin/NewsForm";
import { updateNewsAction } from "../../actions";
import type { NewsFormData } from "@/lib/admin/news-form-schema";
import type { Source, Tag } from "@prisma/client";

export function NewsFormEditClient({
  newsId,
  sources,
  tags,
  defaultValues,
}: {
  newsId: string;
  sources: Source[];
  tags: Tag[];
  defaultValues: Partial<NewsFormData>;
}) {
  async function onSubmit(data: NewsFormData) {
    await updateNewsAction(newsId, data);
  }

  return (
    <NewsForm
      sources={sources}
      tags={tags}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitLabel="Save changes"
      cancelHref="/admin/news"
    />
  );
}
