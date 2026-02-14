import Link from "next/link";
import { getAdminSources, getAllSources } from "@/lib/db/sources";
import type { AdminSourceSortBy, AdminSourceSortOrder } from "@/types";
import { SourceFilters } from "@/components/admin/SourceFilters";
import { SourceTable } from "@/components/admin/SourceTable";
import { Pagination } from "@/components/ui/Pagination";
import { SourceSuccessBanner } from "./SourceSuccessBanner";

const PAGE_SIZE = 20;

export default async function AdminSourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params?.page ?? "1"), 10) || 1);
  const search = String(params?.search ?? "").trim();
  const active = String(params?.active ?? "").trim();
  const sortBy = (params?.sortBy === "newsCount" ? "newsCount" : "name") as AdminSourceSortBy;
  const sortOrder = (params?.sortOrder === "desc" ? "desc" : "asc") as AdminSourceSortOrder;

  const filters = {
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    active: active || undefined,
    sortBy,
    sortOrder,
  };

  const [result, allSources] = await Promise.all([
    getAdminSources(filters),
    getAllSources(false),
  ]);

  const searchParamsForPagination: Record<string, string> = {};
  if (search) searchParamsForPagination.search = search;
  if (active) searchParamsForPagination.active = active;
  searchParamsForPagination.sortBy = sortBy;
  searchParamsForPagination.sortOrder = sortOrder;

  const otherSources = allSources.map((s) => ({ id: s.id, name: s.name }));

  return (
    <div className="max-w-6xl space-y-6">
      <SourceSuccessBanner />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900">
          Source Management
        </h1>
        <Link
          href="/admin/sources/create"
          className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
        >
          Create New Source
        </Link>
      </div>

      <SourceFilters
        search={search}
        active={active}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

      {result.items.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center shadow-sm">
          <p className="text-neutral-500">
            {search || active
              ? "No sources match your filters. Try adjusting the filters."
              : "No sources yet. Create your first source."}
          </p>
          {!search && !active && (
            <Link
              href="/admin/sources/create"
              className="mt-4 inline-block rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Create New Source
            </Link>
          )}
        </div>
      ) : (
        <>
          <SourceTable items={result.items} otherSources={otherSources} />
          {result.totalPages > 1 && (
            <Pagination
              currentPage={result.page}
              totalPages={result.totalPages}
              basePath="/admin/sources"
              searchParams={searchParamsForPagination}
            />
          )}
        </>
      )}
    </div>
  );
}
