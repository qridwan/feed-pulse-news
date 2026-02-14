import { StoragePanel } from "./StoragePanel";

export default function AdminStoragePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
        Storage
      </h1>
      <p className="text-neutral-500 mb-6">
        Supabase Storage buckets and orphaned image cleanup.
      </p>
      <StoragePanel />
    </div>
  );
}
