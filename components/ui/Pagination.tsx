"use client";

import Link from "next/link";
import { useMemo } from "react";
import { clsx } from "clsx";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string>;
  /** Max page number links to show (e.g. 5 => 1 ... 4 5 6 ... 10) */
  maxVisible?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
  maxVisible = 5,
}: PaginationProps) {
  const pages = useMemo(() => {
    if (totalPages <= 1) return [];
    type PageItem = number | { type: "ellipsis"; id: "start" | "end" };
    const list: PageItem[] = [];
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) list.push(i);
    } else {
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(1, currentPage - half);
      const end = Math.min(totalPages, start + maxVisible - 1);
      if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
      if (start > 1) {
        list.push(1);
        if (start > 2) list.push({ type: "ellipsis", id: "start" });
      }
      for (let i = start; i <= end; i++) list.push(i);
      if (end < totalPages) {
        if (end < totalPages - 1) list.push({ type: "ellipsis", id: "end" });
        list.push(totalPages);
      }
    }
    return list;
  }, [currentPage, totalPages, maxVisible]);

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    const q = params.toString();
    return q ? `${basePath}?${q}` : basePath;
  }

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-1 sm:gap-2"
      aria-label="Pagination"
    >
      <Link
        href={buildUrl(currentPage - 1)}
        className={clsx(
          "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
          currentPage <= 1
            ? "pointer-events-none text-neutral-400"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        )}
        aria-disabled={currentPage <= 1}
      >
        Previous
      </Link>
      <ul className="flex items-center gap-1">
        {pages.map((p) =>
          typeof p === "object" && p.type === "ellipsis" ? (
            <li key={`ellipsis-${p.id}`} className="px-2 text-neutral-400">
              …
            </li>
          ) : typeof p === "number" ? (
            <li key={p}>
              <Link
                href={buildUrl(p)}
                className={clsx(
                  "flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-medium transition-colors",
                  p === currentPage
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                {p}
              </Link>
            </li>
          ) : null
        )}
      </ul>
      <Link
        href={buildUrl(currentPage + 1)}
        className={clsx(
          "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
          currentPage >= totalPages
            ? "pointer-events-none text-neutral-400"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        )}
        aria-disabled={currentPage >= totalPages}
      >
        Next
      </Link>
    </nav>
  );
}
