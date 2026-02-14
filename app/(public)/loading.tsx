import { NewsList } from "@/components/news/NewsList";

export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="h-9 w-48 rounded-lg bg-neutral-200 animate-pulse" />
        <div className="h-9 w-56 rounded-lg bg-neutral-200 animate-pulse" />
      </div>
      <NewsList
        items={[]}
        totalPages={1}
        currentPage={1}
        searchParams={{}}
        isLoading
      />
    </div>
  );
}
