import Link from "next/link";
import { SourceCreateClient } from "./SourceCreateClient";

export default function AdminSourceCreatePage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/sources"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          ← Back to list
        </Link>
      </div>
      <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900 mb-6">
        Create source
      </h1>
      <SourceCreateClient />
    </div>
  );
}
