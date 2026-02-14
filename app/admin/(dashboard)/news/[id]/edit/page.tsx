import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsById } from "@/lib/db/news";
import { getAllSources } from "@/lib/db/sources";
import { getAllTags } from "@/lib/db/tags";
import type { NewsFormData } from "@/lib/admin/news-form-schema";
import { NewsFormEditClient } from "./NewsFormEditClient";

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [news, sources, tags] = await Promise.all([
    getNewsById(id),
    getAllSources(false),
    getAllTags(),
  ]);

  if (!news) {
    notFound();
  }

  const defaultValues: Partial<NewsFormData> = {
    title: news.title,
    publishedDate: new Date(news.publishedDate).toISOString().slice(0, 16),
    sourceId: news.sourceId,
    newsLink: news.newsLink ?? "",
    shortDescription: news.shortDescription,
    fullContent: news.fullContent,
    thumbnailUrl: news.thumbnailUrl ?? "",
    additionalImages: news.images?.length
      ? news.images.map((i) => i.url).join(",")
      : undefined,
    tagIds: news.newsTags.map((nt) => nt.tag.id),
    status: news.status,
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/news"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          ← Back to list
        </Link>
      </div>
      <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">
        Edit article
      </h1>
      <NewsFormEditClient
        newsId={id}
        sources={sources}
        tags={tags}
        defaultValues={defaultValues}
      />
    </div>
  );
}
