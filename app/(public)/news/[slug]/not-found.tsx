import Link from "next/link";

export default function NewsNotFound() {
  return (
    <div className="mx-auto max-w-[680px] px-4 py-12 text-center">
      <h1 className="text-xl font-semibold text-neutral-900 mb-2">
        Article not found
      </h1>
      <p className="text-neutral-600 mb-4">
        The article you’re looking for doesn’t exist or is no longer available.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        ← Back to news
      </Link>
    </div>
  );
}
