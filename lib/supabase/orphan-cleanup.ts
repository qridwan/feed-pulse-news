/**
 * Orphaned image cleanup: find and delete Supabase Storage objects that are
 * no longer referenced in the database (News.thumbnailUrl, NewsImage.url, Source.logoUrl).
 *
 * Run manually or from a cron job. Use with care — consider a dry run first.
 *
 * Usage (Node/TS):
 *   import { findAndDeleteOrphanedImages, listReferencedStoragePaths } from "@/lib/supabase/orphan-cleanup";
 *   const result = await findAndDeleteOrphanedImages({ dryRun: true });
 */

import { prisma } from "@/lib/prisma";
import { deleteFromSupabase, listFiles } from "./storage-helpers";
import { BUCKETS } from "./bucket-config";

const SUPABASE_PUBLIC_OBJECT_PREFIX = "/storage/v1/object/public/";

export interface ReferencedPath {
  bucket: string;
  path: string;
}

/**
 * Parse a Supabase Storage public URL into bucket and path.
 * Returns null if the URL is not a Supabase public object URL.
 */
export function parseSupabasePublicUrl(url: string | null | undefined): ReferencedPath | null {
  if (!url || typeof url !== "string" || !url.includes(SUPABASE_PUBLIC_OBJECT_PREFIX)) {
    return null;
  }
  const idx = url.indexOf(SUPABASE_PUBLIC_OBJECT_PREFIX);
  const after = url.slice(idx + SUPABASE_PUBLIC_OBJECT_PREFIX.length);
  const firstSlash = after.indexOf("/");
  if (firstSlash === -1) return null;
  const bucket = after.slice(0, firstSlash);
  const path = decodeURIComponent(after.slice(firstSlash + 1));
  return path ? { bucket, path } : null;
}

/**
 * Collect all storage paths that are referenced in the database.
 */
export async function listReferencedStoragePaths(): Promise<Set<string>> {
  const key = (bucket: string, path: string) => `${bucket}:${path}`;
  const set = new Set<string>();

  const [thumbnails, newsImages, logos] = await Promise.all([
    prisma.news.findMany({ select: { thumbnailUrl: true } }),
    prisma.newsImage.findMany({ select: { url: true } }),
    prisma.source.findMany({ select: { logoUrl: true } }),
  ]);

  for (const { thumbnailUrl } of thumbnails) {
    const ref = parseSupabasePublicUrl(thumbnailUrl);
    if (ref) set.add(key(ref.bucket, ref.path));
  }
  for (const { url } of newsImages) {
    const ref = parseSupabasePublicUrl(url);
    if (ref) set.add(key(ref.bucket, ref.path));
  }
  for (const { logoUrl } of logos) {
    const ref = parseSupabasePublicUrl(logoUrl);
    if (ref) set.add(key(ref.bucket, ref.path));
  }

  return set;
}

async function listAllPathsInBucket(
  bucket: string,
  prefix: string
): Promise<string[]> {
  const paths: string[] = [];
  const { files, folders, error } = await listFiles(bucket, prefix);

  if (error) {
    throw error;
  }

  for (const f of files) {
    paths.push(prefix ? `${prefix}/${f.name}` : f.name);
  }
  for (const folder of folders) {
    const subPrefix = prefix ? `${prefix}/${folder}` : folder;
    const subPaths = await listAllPathsInBucket(bucket, subPrefix);
    paths.push(...subPaths);
  }

  return paths;
}

export interface OrphanCleanupOptions {
  /** If true, only report what would be deleted; do not delete. */
  dryRun?: boolean;
  /** Buckets to scan; default both news-images and source-logos. */
  buckets?: string[];
}

export interface OrphanCleanupResult {
  deleted: string[];
  errors: { path: string; error: string }[];
  dryRun: boolean;
}

/**
 * Find objects in the given buckets that are not referenced in the DB, and delete them (unless dryRun).
 */
export async function findAndDeleteOrphanedImages(
  options: OrphanCleanupOptions = {}
): Promise<OrphanCleanupResult> {
  const { dryRun = false, buckets = Object.values(BUCKETS) } = options;
  const referenced = await listReferencedStoragePaths();
  const key = (b: string, p: string) => `${b}:${p}`;

  const deleted: string[] = [];
  const errors: { path: string; error: string }[] = [];

  for (const bucket of buckets) {
    let prefixPaths: string[];
    try {
      prefixPaths = await listAllPathsInBucket(bucket, "");
    } catch (e) {
      errors.push({
        path: `${bucket}/`,
        error: e instanceof Error ? e.message : String(e),
      });
      continue;
    }

    for (const path of prefixPaths) {
      const k = key(bucket, path);
      if (referenced.has(k)) continue;

      if (dryRun) {
        deleted.push(k);
        continue;
      }

      const { error } = await deleteFromSupabase(bucket, path);
      if (error) {
        errors.push({ path: k, error: error.message });
      } else {
        deleted.push(k);
      }
    }
  }

  return { deleted, errors, dryRun };
}
