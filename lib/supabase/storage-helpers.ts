/**
 * Supabase Storage helper API: upload, delete, URL, list, move.
 * Uses service role client — server-only.
 */

import { createServiceRoleClient } from "./server";
import {
  uploadImage,
  deleteImage,
  getPublicUrl as getStoragePublicUrl,
} from "./storage";

export type UploadInput = File | Blob | ArrayBuffer | Buffer | Uint8Array;

export interface UploadResult {
  path: string;
  error: Error | null;
}

/**
 * Upload a file to a Supabase Storage bucket.
 */
export async function uploadToSupabase(
  file: UploadInput,
  bucket: string,
  path: string,
  options?: { contentType?: string; upsert?: boolean }
): Promise<UploadResult> {
  const body =
    typeof Buffer !== "undefined" &&
    file instanceof Uint8Array &&
    !(file instanceof Buffer)
      ? Buffer.from(file)
      : (file as File | Blob | ArrayBuffer | Buffer);
  return uploadImage(body, bucket, path, {
    contentType: options?.contentType,
    upsert: options?.upsert,
  });
}

/**
 * Delete a file from a Supabase Storage bucket.
 */
export async function deleteFromSupabase(
  bucket: string,
  path: string
): Promise<{ error: Error | null }> {
  return deleteImage(bucket, path);
}

/**
 * Get the public URL for a file in a public bucket.
 */
export function getPublicUrl(bucket: string, path: string): string {
  return getStoragePublicUrl(bucket, path);
}

/** One item returned from list (file or folder) */
export interface StorageObject {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  metadata?: Record<string, unknown>;
}

export interface ListFilesOptions {
  limit?: number;
  offset?: number;
  sortBy?: { column: "name" | "updated_at" | "created_at"; order: "asc" | "desc" };
}

export interface ListFilesResult {
  files: StorageObject[];
  folders: string[];
  error: Error | null;
}

/**
 * List files and folders in a bucket (optionally under a prefix).
 */
export async function listFiles(
  bucket: string,
  prefix = "",
  options: ListFilesOptions = {}
): Promise<ListFilesResult> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, {
        limit: options.limit ?? 100,
        offset: options.offset ?? 0,
        sortBy: options.sortBy ?? { column: "name", order: "asc" },
      });

    if (error) {
      return {
        files: [],
        folders: [],
        error: new Error(error.message),
      };
    }

    const files: StorageObject[] = [];
    const folders: string[] = [];

    for (const item of data ?? []) {
      if (item.id == null) {
        folders.push(item.name);
      } else {
        files.push({
          name: item.name,
          id: item.id,
          updated_at: item.updated_at,
          created_at: item.created_at,
          metadata: item.metadata as Record<string, unknown> | undefined,
        });
      }
    }

    return { files, folders, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[listFiles]", error);
    return { files: [], folders: [], error };
  }
}

export interface MoveFileOptions {
  destinationBucket?: string;
}

export interface MoveFileResult {
  error: Error | null;
}

/**
 * Move a file within the same bucket or to another bucket.
 * The source file is removed after a successful move.
 */
export async function moveFile(
  bucket: string,
  oldPath: string,
  newPath: string,
  options: MoveFileOptions = {}
): Promise<MoveFileResult> {
  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.storage
      .from(bucket)
      .move(oldPath, newPath, {
        destinationBucket: options.destinationBucket,
      });

    if (error) {
      return { error: new Error(error.message) };
    }
    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[moveFile]", error);
    return { error };
  }
}
