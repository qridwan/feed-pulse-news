"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SourceSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const created = searchParams.get("created");
    const saved = searchParams.get("saved");
    if (created === "1") {
      setMessage("Source created successfully.");
    } else if (saved === "1") {
      setMessage("Source saved successfully.");
    } else {
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.delete("created");
    params.delete("saved");
    const q = params.toString();
    router.replace(q ? `/admin/sources?${q}` : "/admin/sources", { scroll: false });
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [searchParams, router]);

  if (!message) return null;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {message}
    </div>
  );
}
