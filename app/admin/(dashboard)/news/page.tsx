import Link from "next/link";
import { getAdminNews } from "@/lib/db/news";
import { getAllSources } from "@/lib/db/sources";
import type { AdminNewsFilters, AdminNewsSortBy, AdminNewsSortOrder } from "@/types";
import { Status } from "@prisma/client";
import { NewsFilters } from "@/components/admin/NewsFilters";
import { NewsTable } from "@/components/admin/NewsTable";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 20;

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params?.page ?? "1"), 10) || 1);
  const search = String(params?.search ?? "").trim();
  const statusParam = String(params?.status ?? "").trim();
  const status =
    statusParam === "DRAFT" || statusParam === "PUBLISHED" || statusParam === "ARCHIVED"
      ? (statusParam as Status)
      : undefined;
  const sourceId = String(params?.sourceId ?? "").trim() || undefined;
  const sortBy = (params?.sortBy === "title" ? "title" : "date") as AdminNewsSortBy;
  const sortOrder = (params?.sortOrder === "asc" ? "asc" : "desc") as AdminNewsSortOrder;

  const filters: AdminNewsFilters = {
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    status,
    sourceId,
    sortBy,
    sortOrder,
  };

  const [result, sources] = await Promise.all([
    getAdminNews(filters),
    getAllSources(false),
  ]);

  const searchParamsForPagination: Record<string, string> = {};
  if (search) searchParamsForPagination.search = search;
  if (status) searchParamsForPagination.status = status;
  if (sourceId) searchParamsForPagination.sourceId = sourceId;
  searchParamsForPagination.sortBy = sortBy;
  searchParamsForPagination.sortOrder = sortOrder;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900">
          News Management
        </h1>
        <Link
          href="/admin/news/create"
          className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
        >
          Create New
        </Link>
      </div>

      <NewsFilters
        search={search}
        status={status ?? ""}
        sourceId={sourceId ?? ""}
        sortBy={sortBy}
        sortOrder={sortOrder}
        sources={sources}
      />

      {result.items.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center shadow-sm">
          <p className="text-neutral-500">
            {search || status || sourceId
              ? "No articles match your filters. Try adjusting the filters."
              : "No news articles yet. Create your first article."}
          </p>
          {!(search || status || sourceId) && (
            <Link
              href="/admin/news/create"
              className="mt-4 inline-block rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Create New
            </Link>
          )}
        </div>
      ) : (
        <>
          <NewsTable items={result.items} />
          {result.totalPages > 1 && (
            <Pagination
              currentPage={result.page}
              totalPages={result.totalPages}
              basePath="/admin/news"
              searchParams={searchParamsForPagination}
            />
          )}
        </>
      )}
    </div>
  );
}
