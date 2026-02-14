export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <span
          className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900"
          aria-hidden
        />
        <p className="text-sm text-neutral-500">Loading…</p>
      </div>
    </div>
  );
}
