"use client";

import { useState } from "react";
import { runOrphanCleanup, type OrphanCleanupResult } from "./actions";

export function StoragePanel() {
  const [result, setResult] = useState<OrphanCleanupResult | null>(null);
  const [loading, setLoading] = useState<"dry" | "run" | null>(null);

  const handleDryRun = async () => {
    setLoading("dry");
    setResult(null);
    try {
      const r = await runOrphanCleanup(true);
      setResult(r);
    } finally {
      setLoading(null);
    }
  };

  const handleRun = async () => {
    setLoading("run");
    setResult(null);
    try {
      const r = await runOrphanCleanup(false);
      setResult(r);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900 mb-1">
          Orphaned image cleanup
        </h2>
        <p className="text-sm text-neutral-500 mb-4">
          Find and delete Supabase Storage objects that are no longer referenced
          in the database (news thumbnails, news images, source logos). Run a dry
          run first to see what would be removed.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDryRun}
            disabled={loading !== null}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-60"
          >
            {loading === "dry" ? "Checking…" : "Dry run (preview)"}
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={loading !== null}
            className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 disabled:opacity-60"
          >
            {loading === "run" ? "Deleting…" : "Delete orphaned images"}
          </button>
        </div>
      </section>

      {result && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-neutral-900 mb-2">
            {result.dryRun ? "Dry run result" : "Cleanup result"}
          </h3>
          <p className="text-sm text-neutral-600 mb-2">
            {result.dryRun
              ? `Would delete ${result.deleted.length} object(s).`
              : `Deleted ${result.deleted.length} object(s).`}
          </p>
          {result.deleted.length > 0 && (
            <ul className="text-xs text-neutral-500 font-mono bg-neutral-50 rounded-lg p-3 max-h-48 overflow-y-auto space-y-1">
              {result.deleted.slice(0, 50).map((path) => (
                <li key={path} className="truncate">
                  {path}
                </li>
              ))}
              {result.deleted.length > 50 && (
                <li>… and {result.deleted.length - 50} more</li>
              )}
            </ul>
          )}
          {result.errors.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-red-600 mb-1">
                Errors ({result.errors.length})
              </p>
              <ul className="text-xs text-red-600 space-y-1">
                {result.errors.map((e) => (
                  <li key={`${e.path}-${e.error}`}>
                    {e.path}: {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900 mb-1">
          Buckets & config
        </h2>
        <p className="text-sm text-neutral-500 mb-3">
          Upload and limits are configured in{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">
            lib/supabase/bucket-config.ts
          </code>
          {" "}
          and documented in{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">
            docs/supabase-storage-setup.md
          </code>
          {"."}
        </p>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>
            <strong>news-images</strong> — article thumbnails and gallery images
          </li>
          <li>
            <strong>source-logos</strong> — source logos
          </li>
          <li>Max 5 MB per file; JPEG, PNG, WebP, GIF.</li>
        </ul>
      </section>
    </div>
  );
}
