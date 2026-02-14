import Link from "next/link";
import { notFound } from "next/navigation";
import { getSourceById } from "@/lib/db/sources";
import { SourceEditClient } from "./SourceEditClient";

export default async function AdminSourceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const source = await getSourceById(id);

  if (!source) {
    notFound();
  }

  const defaultValues = {
    name: source.name,
    slug: source.slug,
    website: source.website,
    logoUrl: source.logoUrl ?? "",
    description: source.description ?? "",
    isActive: source.isActive,
  };

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
        Edit source
      </h1>
      <SourceEditClient editId={id} defaultValues={defaultValues} />
    </div>
  );
}
