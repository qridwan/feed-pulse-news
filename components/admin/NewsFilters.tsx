"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Source, Status } from "@prisma/client";
import type { AdminNewsSortBy, AdminNewsSortOrder } from "@/types";

const STATUS_OPTIONS: { value: "" | Status; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

const SORT_OPTIONS: { value: `${AdminNewsSortBy}-${AdminNewsSortOrder}`; label: string }[] = [
  { value: "date-desc", label: "Date (newest)" },
  { value: "date-asc", label: "Date (oldest)" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
];

export interface NewsFiltersProps {
  search: string;
  status: string;
  sourceId: string;
  sortBy: AdminNewsSortBy;
  sortOrder: AdminNewsSortOrder;
  sources: Source[];
}

const DEBOUNCE_MS = 300;

export function NewsFilters({
  search: initialSearch,
  status: initialStatus,
  sourceId: initialSourceId,
  sortBy: initialSortBy,
  sortOrder: initialSortOrder,
  sources,
}: NewsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState(initialSearch);

  useEffect(() => {
    setSearchInput(initialSearch);
  }, [initialSearch]);

  const applyParams = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams();
      if (updates.search !== undefined && String(updates.search).trim())
        params.set("search", String(updates.search).trim());
      if (updates.status !== undefined && updates.status !== "")
        params.set("status", String(updates.status));
      if (updates.sourceId !== undefined && updates.sourceId !== "")
        params.set("sourceId", String(updates.sourceId));
      if (updates.sortBy !== undefined) params.set("sortBy", String(updates.sortBy));
      if (updates.sortOrder !== undefined) params.set("sortOrder", String(updates.sortOrder));
      if (updates.page !== undefined) params.set("page", String(updates.page));
      const q = params.toString();
      router.push(q ? `${pathname}?${q}` : pathname);
    },
    [router, pathname]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== initialSearch) {
        applyParams({ search: searchInput, page: 1 });
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput, initialSearch, applyParams]);

  const handleSearchChange = (value: string) => setSearchInput(value);

  const handleStatusChange = (value: string) => {
    applyParams({ status: value, page: 1 });
  };
  const handleSourceChange = (value: string) => {
    applyParams({ sourceId: value, page: 1 });
  };
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [AdminNewsSortBy, AdminNewsSortOrder];
    applyParams({ sortBy, sortOrder });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="flex-1 min-w-0">
        <label htmlFor="news-search" className="sr-only">
          Search by title
        </label>
        <input
          id="news-search"
          type="search"
          placeholder="Search by title…"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Filter by status"
          value={initialStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by source"
          value={initialSourceId}
          onChange={(e) => handleSourceChange(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          <option value="">All sources</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort by"
          value={`${initialSortBy}-${initialSortOrder}`}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
