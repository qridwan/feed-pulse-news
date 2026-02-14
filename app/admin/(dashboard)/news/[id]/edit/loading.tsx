export default function EditNewsLoading() {
  return (
    <div className="max-w-4xl animate-pulse">
      <div className="h-5 w-32 rounded bg-neutral-200 mb-6" />
      <div className="h-9 w-48 rounded bg-neutral-200 mb-6" />
      <div className="space-y-4">
        <div className="h-10 rounded-xl bg-neutral-200" />
        <div className="h-10 rounded-xl bg-neutral-200" />
        <div className="h-24 rounded-xl bg-neutral-200" />
      </div>
    </div>
  );
}
