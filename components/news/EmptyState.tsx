import Link from "next/link";

export function EmptyState() {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 px-6 py-12 text-center">
      <p className="text-neutral-600 mb-4">
        No articles match your filters. Try a different date range or source.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Clear filters
      </Link>
    </div>
  );
}
