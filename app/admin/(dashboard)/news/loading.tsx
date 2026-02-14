export default function NewsLoading() {
  return (
    <div className="max-w-6xl space-y-6 animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-8 w-48 rounded-lg bg-neutral-200" />
        <div className="h-10 w-28 rounded-xl bg-neutral-200" />
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="h-10 flex-1 min-w-[200px] max-w-md rounded-xl bg-neutral-200" />
        <div className="h-10 w-32 rounded-xl bg-neutral-200" />
        <div className="h-10 w-36 rounded-xl bg-neutral-200" />
        <div className="h-10 w-40 rounded-xl bg-neutral-200" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
        <div className="border-b border-neutral-200/80 p-4">
          <div className="flex gap-4">
            <div className="h-12 w-16 rounded-lg bg-neutral-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-neutral-200" />
              <div className="h-3 w-1/2 rounded bg-neutral-100" />
            </div>
            <div className="h-6 w-20 rounded bg-neutral-100" />
            <div className="h-6 w-24 rounded bg-neutral-100" />
          </div>
        </div>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-neutral-100 p-4 last:border-b-0"
          >
            <div className="h-12 w-16 flex-shrink-0 rounded-lg bg-neutral-100" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-full rounded bg-neutral-200" />
              <div className="h-3 w-2/3 rounded bg-neutral-100" />
            </div>
            <div className="h-6 w-6 flex-shrink-0 rounded bg-neutral-100" />
            <div className="h-4 w-20 flex-shrink-0 rounded bg-neutral-100" />
            <div className="h-6 w-16 flex-shrink-0 rounded bg-neutral-100" />
            <div className="flex flex-shrink-0 gap-2">
              <div className="h-8 w-12 rounded-lg bg-neutral-100" />
              <div className="h-8 w-14 rounded-lg bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <div className="h-9 w-20 rounded-xl bg-neutral-200" />
        <div className="h-9 w-9 rounded-xl bg-neutral-200" />
        <div className="h-9 w-9 rounded-xl bg-neutral-200" />
        <div className="h-9 w-20 rounded-xl bg-neutral-200" />
      </div>
    </div>
  );
}
