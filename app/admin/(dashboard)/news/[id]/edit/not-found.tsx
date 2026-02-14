import Link from "next/link";

export default function EditNewsNotFound() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
        Article not found
      </h1>
      <p className="text-neutral-500 mb-4">
        The article you’re looking for doesn’t exist or was removed.
      </p>
      <Link
        href="/admin/news"
        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        ← Back to news list
      </Link>
    </div>
  );
}
