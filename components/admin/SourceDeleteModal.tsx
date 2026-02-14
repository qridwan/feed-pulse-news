"use client";

import { useState, useEffect } from "react";
import { deleteSourceAction } from "@/app/admin/(dashboard)/sources/actions";
import type { SourceWithNewsCount } from "@/types";

export interface SourceDeleteModalProps {
  source: SourceWithNewsCount | null;
  otherSources: { id: string; name: string }[];
  onClose: () => void;
  onDeleted: () => void;
}

export function SourceDeleteModal({
  source,
  otherSources,
  onClose,
  onDeleted,
}: SourceDeleteModalProps) {
  const [reassignToId, setReassignToId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasNews = source ? source._count.news > 0 : false;
  const canDeleteWithReassign = hasNews && reassignToId && reassignToId !== source?.id;

  useEffect(() => {
    if (!source) {
      setReassignToId("");
      setError(null);
      return;
    }
    setReassignToId(otherSources[0]?.id ?? "");
  }, [source, otherSources]);

  useEffect(() => {
    if (!source) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [source, onClose]);

  async function handleConfirm() {
    if (!source) return;
    const doReassign = hasNews && reassignToId && reassignToId !== source.id;
    if (hasNews && !doReassign) {
      setError("Select a source to reassign news to, or delete a source with no news.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await deleteSourceAction(source.id, doReassign ? reassignToId : undefined);
      onDeleted();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  if (!source) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-delete-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-neutral-200/80">
        <h2
          id="source-delete-modal-title"
          className="text-lg font-semibold text-neutral-900 mb-1"
        >
          Delete source
        </h2>
        <p className="text-sm text-neutral-500 mb-4">
          Are you sure you want to delete <strong>{source.name}</strong>?
        </p>

        {hasNews && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800 mb-2">
              This source has <strong>{source._count.news} news article(s)</strong>. You must
              reassign them to another source before deleting.
            </p>
            <label htmlFor="reassign-source" className="block text-sm font-medium text-neutral-700 mb-1">
              Reassign news to
            </label>
            <select
              id="reassign-source"
              value={reassignToId}
              onChange={(e) => setReassignToId(e.target.value)}
              disabled={busy}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              <option value="">Select a source…</option>
              {otherSources
                .filter((s) => s.id !== source.id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy || (hasNews && !canDeleteWithReassign)}
            className="rounded-xl px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {busy && (
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden
              />
            )}
            {hasNews ? "Reassign and delete" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
