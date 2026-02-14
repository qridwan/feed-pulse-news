/**
 * Client for public sources API (active sources only).
 * - fetchSources(): use from client (browser)
 * - fetchSourcesServer(): use from server components (pass baseUrl or use getBaseUrl())
 */

export interface PublicSource {
  id: string;
  name: string;
  slug: string;
  website: string;
  logoUrl: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Call from server components; builds base URL from env or headers. */
export async function getBaseUrl(): Promise<string> {
  try {
    const { headers } = await import("next/headers");
    const list = await headers();
    const host = list.get("host");
    const proto = list.get("x-forwarded-proto") ?? "http";
    if (host) return `${proto}://${host}`;
  } catch {
    // no headers (e.g. static export)
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function fetchSources(): Promise<PublicSource[]> {
  const res = await fetch("/api/sources", {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch sources");
  return res.json();
}

/** Server-side: fetch active sources from public API (uses GET /api/sources). */
export async function fetchSourcesServer(baseUrl?: string): Promise<PublicSource[]> {
  const base = baseUrl ?? (await getBaseUrl());
  const res = await fetch(`${base}/api/sources`, {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch sources");
  return res.json();
}
