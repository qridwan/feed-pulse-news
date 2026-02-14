"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { deleteNewsAction } from "@/app/admin/(dashboard)/news/actions";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import type { NewsWithRelations } from "@/types";
import type { Status } from "@prisma/client";
import { clsx } from "clsx";

export interface NewsTableProps {
  items: NewsWithRelations[];
}

const statusStyles: Record<Status, string> = {
  DRAFT: "bg-amber-100 text-amber-800 border-amber-200",
  PUBLISHED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  ARCHIVED: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-lg border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status]
      )}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export function NewsTable({ items }: NewsTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<NewsWithRelations | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteNewsAction(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200/80">
              <th className="py-3 pl-4 pr-2 font-medium text-neutral-500">Thumbnail</th>
              <th className="py-3 px-2 font-medium text-neutral-500">Title</th>
              <th className="py-3 px-2 font-medium text-neutral-500">Source</th>
              <th className="py-3 px-2 font-medium text-neutral-500">Published</th>
              <th className="py-3 px-2 font-medium text-neutral-500">Status</th>
              <th className="py-3 pl-2 pr-4 font-medium text-neutral-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((news) => (
              <tr
                key={news.id}
                className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 transition-colors"
              >
                <td className="py-3 pl-4 pr-2">
                  <div className="h-12 w-16 overflow-hidden rounded-lg bg-neutral-100 shrink-0">
                    {news.thumbnailUrl ? (
                      <img
                        src={news.thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-neutral-400 text-xs">
                        —
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <Link
                    href={`/admin/news/${news.id}/edit`}
                    className="font-medium text-neutral-900 hover:underline focus:outline-none focus:ring-2 focus:ring-neutral-400 rounded"
                  >
                    {news.title}
                  </Link>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    {news.source.logoUrl ? (
                      <img
                        src={news.source.logoUrl}
                        alt=""
                        className="h-6 w-6 rounded object-contain shrink-0"
                      />
                    ) : (
                      <span className="h-6 w-6 rounded bg-neutral-200 shrink-0" />
                    )}
                    <span className="text-neutral-700 truncate max-w-[140px]">
                      {news.source.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-neutral-600 whitespace-nowrap">
                  {format(new Date(news.publishedDate), "MMM d, yyyy")}
                </td>
                <td className="py-3 px-2">
                  <StatusBadge status={news.status} />
                </td>
                <td className="py-3 pl-2 pr-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/news/${news.id}/edit`}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(news)}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete article?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” will be permanently deleted. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
        busy={deleting}
      />
    </>
  );
}
