"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { AdminSourceSortBy, AdminSourceSortOrder } from "@/types";

const ACTIVE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const SORT_OPTIONS: { value: `${AdminSourceSortBy}-${AdminSourceSortOrder}`; label: string }[] = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "newsCount-desc", label: "News count (high first)" },
  { value: "newsCount-asc", label: "News count (low first)" },
];

export interface SourceFiltersProps {
  search: string;
  active: string;
  sortBy: AdminSourceSortBy;
  sortOrder: AdminSourceSortOrder;
}

const DEBOUNCE_MS = 300;

export function SourceFilters({
  search: initialSearch,
  active: initialActive,
  sortBy: initialSortBy,
  sortOrder: initialSortOrder,
}: SourceFiltersProps) {
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
      if (updates.active !== undefined && updates.active !== "")
        params.set("active", String(updates.active));
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

  const handleActiveChange = (value: string) => {
    applyParams({ active: value, page: 1 });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [AdminSourceSortBy, AdminSourceSortOrder];
    applyParams({ sortBy, sortOrder });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="flex-1 min-w-0">
        <label htmlFor="source-search" className="sr-only">
          Search by name
        </label>
        <input
          id="source-search"
          type="search"
          placeholder="Search by name…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Filter by status"
          value={initialActive}
          onChange={(e) => handleActiveChange(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          {ACTIVE_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
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
