import { NextResponse } from "next/server";

const DEFAULT_REVALIDATE = 60; // 1 minute
const MAX_AGE = 60; // 1 minute for stale-while-revalidate

export interface CacheHeadersOptions {
  /** Seconds until response is considered stale (max-age) */
  maxAge?: number;
  /** Seconds for stale-while-revalidate (swr) */
  staleWhileRevalidate?: number;
  /** Set to "no-store" to disable caching */
  cacheControl?: "public" | "private" | "no-store";
}

/**
 * Apply cache headers to a JSON NextResponse.
 * Use for public read-only API responses.
 */
export function withCacheHeaders(
  response: NextResponse,
  options: CacheHeadersOptions = {}
): NextResponse {
  const {
    maxAge = MAX_AGE,
    staleWhileRevalidate = DEFAULT_REVALIDATE,
    cacheControl = "public",
  } = options;

  if (cacheControl === "no-store") {
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const parts = [
    `${cacheControl}, max-age=${maxAge}`,
    staleWhileRevalidate > 0 ? `stale-while-revalidate=${staleWhileRevalidate}` : null,
  ].filter(Boolean);
  response.headers.set("Cache-Control", parts.join(", "));
  return response;
}

/**
 * Create a JSON response with cache headers.
 */
export function jsonWithCache<T>(
  data: T,
  init: ResponseInit & { cache?: CacheHeadersOptions } = {}
): NextResponse {
  const { cache, ...responseInit } = init;
  const res = NextResponse.json(data, responseInit);
  if (cache) return withCacheHeaders(res, cache);
  return withCacheHeaders(res);
}
