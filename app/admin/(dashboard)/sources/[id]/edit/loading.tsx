export default function AdminSourceEditLoading() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="h-5 w-24 rounded bg-neutral-200 animate-pulse" />
      <div className="h-9 w-48 rounded-xl bg-neutral-200 animate-pulse" />
      <div className="max-w-2xl space-y-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 rounded bg-neutral-200 animate-pulse" />
            <div className="h-10 w-full rounded-xl bg-neutral-200 animate-pulse" />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <div className="h-10 w-24 rounded-xl bg-neutral-200 animate-pulse" />
          <div className="h-10 w-20 rounded-xl bg-neutral-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
