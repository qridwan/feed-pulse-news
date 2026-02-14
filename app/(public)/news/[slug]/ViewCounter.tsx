"use client";

import { useEffect } from "react";

async function incrementView(slug: string) {
  await fetch(`/api/news/${slug}/view`, { method: "POST" });
}

export function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    incrementView(slug);
  }, [slug]);
  return null;
}
