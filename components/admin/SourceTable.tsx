"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAdminSource } from "@/lib/api/admin-sources-client";
import { SourceDeleteModal } from "@/components/admin/SourceDeleteModal";
import type { SourceWithNewsCount } from "@/types";
import { clsx } from "clsx";

export interface SourceTableProps {
  items: SourceWithNewsCount[];
  /** Other sources (for reassignment dropdown when deleting) */
  otherSources: { id: string; name: string }[];
}

export function SourceTable({ items, otherSources }: SourceTableProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<SourceWithNewsCount | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleToggleActive(source: SourceWithNewsCount) {
    setTogglingId(source.id);
    try {
      await updateAdminSource(source.id, { isActive: !source.isActive });
      router.refresh();
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200/80">
              <th className="py-3 pl-4 pr-2 font-medium text-neutral-500">Logo</th>
              <th className="py-3 px-2 font-medium text-neutral-500">Name</th>
              <th className="py-3 px-2 font-medium text-neutral-500">Website</th>
              <th className="py-3 px-2 font-medium text-neutral-500">News</th>
              <th className="py-3 px-2 font-medium text-neutral-500">Status</th>
              <th className="py-3 pl-2 pr-4 font-medium text-neutral-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((source) => (
              <tr
                key={source.id}
                className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 transition-colors"
              >
                <td className="py-3 pl-4 pr-2">
                  <div className="h-10 w-10 overflow-hidden rounded-lg bg-neutral-100 shrink-0">
                    {source.logoUrl ? (
                      <Image
                        src={source.logoUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-neutral-400 text-xs">
                        —
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2 font-medium text-neutral-900">
                  {source.name}
                </td>
                <td className="py-3 px-2">
                  <a
                    href={source.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-neutral-900 hover:underline truncate max-w-[180px] inline-block"
                  >
                    {source.website}
                  </a>
                </td>
                <td className="py-3 px-2 text-neutral-600">
                  {source._count.news}
                </td>
                <td className="py-3 px-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(source)}
                    disabled={togglingId === source.id}
                    className={clsx(
                      "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                      source.isActive
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
                        : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200",
                      togglingId === source.id && "opacity-60"
                    )}
                  >
                    {togglingId === source.id
                      ? "…"
                      : source.isActive
                        ? "Active"
                        : "Inactive"}
                  </button>
                </td>
                <td className="py-3 pl-2 pr-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/sources/${source.id}/edit`}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(source)}
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

      <SourceDeleteModal
        source={deleteTarget}
        otherSources={otherSources}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => setDeleteTarget(null)}
      />
    </>
  );
}
