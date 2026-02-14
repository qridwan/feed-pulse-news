"use client";

import Link from "next/link";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 text-center">
      <h1 className="text-xl font-semibold text-neutral-900 mb-2">
        Something went wrong
      </h1>
      <p className="text-neutral-600 mb-6 max-w-md mx-auto">
        We couldn’t load the news. You can try again or go back to the home page.
      </p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
