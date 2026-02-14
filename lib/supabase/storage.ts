import type { TransformOptions } from "@supabase/storage-js";
import { createServiceRoleClient } from "./server";

// ---------------------------------------------------------------------------
// Bucket configuration
// Create these buckets in Supabase Dashboard → Storage (e.g. public access for reading).
// ---------------------------------------------------------------------------

export const BUCKETS = {
  NEWS_IMAGES: "news-images",
  SOURCE_LOGOS: "source-logos",
} as const;

export type StorageBucket = (typeof BUCKETS)[keyof typeof BUCKETS];

// ---------------------------------------------------------------------------
// Upload / delete / URL
// ---------------------------------------------------------------------------

export type UploadImageInput = File | Blob | ArrayBuffer | Buffer;

/**
 * Upload an image to a storage bucket. Use the service role client (server-only).
 */
export async function uploadImage(
  file: UploadImageInput,
  bucket: string,
  path: string,
  options?: { contentType?: string; upsert?: boolean }
): Promise<{ path: string; error: Error | null }> {
  try {
    const supabase = createServiceRoleClient();
    const body = file instanceof Buffer ? new Uint8Array(file) : file;
    const contentType =
      options?.contentType ??
      (file instanceof File ? file.type : "image/jpeg");

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, body, {
        contentType,
        cacheControl: "31536000",
        upsert: options?.upsert ?? true,
      });

    if (error) return { path: "", error };
    return { path: data.path, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[uploadImage]", error);
    return { path: "", error };
  }
}

/**
 * Delete an image from a storage bucket.
 */
export async function deleteImage(
  bucket: string,
  path: string
): Promise<{ error: Error | null }> {
  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) return { error: new Error(error.message) };
    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[deleteImage]", error);
    return { error };
  }
}

/**
 * Get the public URL for a file in a public bucket.
 */
export function getPublicUrl(bucket: string, path: string): string {
  const supabase = createServiceRoleClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}

// ---------------------------------------------------------------------------
// Image optimization helpers (Supabase Image Transformations)
// Use these to build URLs with resize/WebP. Requires Supabase Pro for transforms.
// ---------------------------------------------------------------------------

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
  /** Omit to allow WebP optimization; use "origin" to keep original format. */
  format?: "origin";
}

/**
 * Get a public URL with optional image transformation (resize, quality, WebP).
 * Supabase serves optimized WebP by default when format is not "origin".
 */
export function getPublicUrlWithTransform(
  bucket: string,
  path: string,
  transform: ImageTransformOptions
): string {
  const supabase = createServiceRoleClient();
  const opts: { transform?: TransformOptions } = {};
  if (
    transform.width != null ||
    transform.height != null ||
    transform.quality != null ||
    transform.resize != null ||
    transform.format != null
  ) {
    opts.transform = {
      width: transform.width,
      height: transform.height,
      quality: transform.quality,
      resize: transform.resize,
      format: transform.format,
    };
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path, opts);
  return publicUrl;
}

/**
 * Get a resized image URL (convenience for thumbnails/cards).
 */
const DEFAULT_RESIZE_OPTIONS = { width: 800 };

export function getResizedImageUrl(
  bucket: string,
  path: string,
  options: { width: number; height?: number; quality?: number } = DEFAULT_RESIZE_OPTIONS
): string {
  return getPublicUrlWithTransform(bucket, path, {
    width: options.width,
    height: options.height,
    quality: options.quality ?? 80,
    resize: "contain",
  });
}

/**
 * Get an image URL optimized for WebP (no format override).
 * Supabase will serve WebP when the client supports it.
 */
export function getWebPOptimizedUrl(
  bucket: string,
  path: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  return getPublicUrlWithTransform(bucket, path, {
    width: options?.width,
    height: options?.height,
    quality: options?.quality ?? 80,
  });
}
