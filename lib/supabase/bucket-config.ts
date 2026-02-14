/**
 * Bucket names and configuration for Supabase Storage.
 * Keep in sync with docs/supabase-storage-setup.md.
 */

export const BUCKETS = {
  NEWS_IMAGES: "news-images",
  SOURCE_LOGOS: "source-logos",
} as const;

export type StorageBucket = (typeof BUCKETS)[keyof typeof BUCKETS];

/** All bucket IDs as a tuple for validation */
export const BUCKET_IDS: readonly string[] = Object.values(BUCKETS);

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

/** Max file size in bytes (5 MB) */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export interface BucketConfig {
  name: string;
  maxSizeBytes: number;
  allowedMimeTypes: readonly string[];
}

export const BUCKET_CONFIGS: Record<StorageBucket, BucketConfig> = {
  [BUCKETS.NEWS_IMAGES]: {
    name: BUCKETS.NEWS_IMAGES,
    maxSizeBytes: MAX_FILE_SIZE_BYTES,
    allowedMimeTypes: [...ALLOWED_MIME_TYPES],
  },
  [BUCKETS.SOURCE_LOGOS]: {
    name: BUCKETS.SOURCE_LOGOS,
    maxSizeBytes: MAX_FILE_SIZE_BYTES,
    allowedMimeTypes: [...ALLOWED_MIME_TYPES],
  },
};

/**
 * Build the public URL for a file in a Supabase Storage bucket.
 * Use when you have the base URL and do not want to create a Supabase client.
 */
export function buildPublicUrl(
  supabaseUrl: string,
  bucket: string,
  path: string
): string {
  const base = supabaseUrl.replace(/\/$/, "");
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/${bucket}/${encodedPath}`;
}

export function isAllowedBucket(bucket: string): bucket is StorageBucket {
  return BUCKET_IDS.includes(bucket);
}

export function isAllowedMimeType(type: string): type is AllowedMimeType {
  return ALLOWED_MIME_TYPES.includes(type as AllowedMimeType);
}
