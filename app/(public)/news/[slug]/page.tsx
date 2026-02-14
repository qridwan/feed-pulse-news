import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getNewsBySlug, getRelatedNews } from "@/lib/db/news";
import { Status } from "@prisma/client";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { NewsContent } from "@/components/news/NewsContent";
import { ImageGallery } from "@/components/news/ImageGallery";
import { RelatedNews } from "@/components/news/RelatedNews";
import { ViewCounter } from "./ViewCounter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news || news.status !== Status.PUBLISHED) {
    return { title: "Not found" };
  }
  return {
    title: `${news.title} | Simply News`,
    description: news.shortDescription,
    openGraph: {
      title: news.title,
      description: news.shortDescription,
      type: "article",
      publishedTime: news.publishedDate.toISOString(),
      images: news.thumbnailUrl ? [news.thumbnailUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description: news.shortDescription,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const news = await getNewsBySlug(slug);
  if (!news || news.status !== Status.PUBLISHED) {
    notFound();
  }

  const related = await getRelatedNews(slug, news.sourceId, 4);

  const isExternalUrl = (url: string) =>
    url.startsWith("http") && !url.startsWith("data:");

  return (
    <article className="mx-auto max-w-[680px] px-4 py-8 sm:px-6">
      <ViewCounter slug={slug} />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "News", href: "/" },
          { label: news.title },
        ]}
      />

      <header className="mt-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 leading-tight">
          {news.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
          <time dateTime={news.publishedDate.toISOString()}>
            {format(new Date(news.publishedDate), "MMM d, yyyy")}
          </time>
          <span aria-hidden>·</span>
          {news.source.website ? (
            <a
              href={news.source.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-neutral-900"
            >
              {news.source.logoUrl ? (
                <span className="relative h-4 w-4 shrink-0 rounded overflow-hidden bg-neutral-100">
                  <Image
                    src={news.source.logoUrl}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="16px"
                    unoptimized={!isExternalUrl(news.source.logoUrl)}
                  />
                </span>
              ) : null}
              <span>{news.source.name}</span>
            </a>
          ) : (
            <span className="flex items-center gap-1.5">
              {news.source.logoUrl ? (
                <span className="relative h-4 w-4 shrink-0 rounded overflow-hidden bg-neutral-100">
                  <Image
                    src={news.source.logoUrl}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="16px"
                    unoptimized={!isExternalUrl(news.source.logoUrl)}
                  />
                </span>
              ) : null}
              {news.source.name}
            </span>
          )}
          <span aria-hidden>·</span>
          <span>{news.views} views</span>
        </div>
      </header>

      {news.thumbnailUrl && (
        <div className="mt-6 relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-100">
          <Image
            src={news.thumbnailUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 680px) 100vw, 680px"
            priority
            unoptimized={!isExternalUrl(news.thumbnailUrl)}
          />
        </div>
      )}

      <div className="mt-8">
        <NewsContent html={news.fullContent} />
      </div>

      {news.images && news.images.length > 0 && (
        <ImageGallery
          images={news.images.map((img) => ({
            id: img.id,
            url: img.url,
            caption: img.caption,
          }))}
        />
      )}

      {news.newsTags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {news.newsTags.map(({ tag }) => (
            <Link
              key={tag.id}
              href="/"
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-neutral-100">
          <RelatedNews items={related} />
        </div>
      )}
    </article>
  );
}
