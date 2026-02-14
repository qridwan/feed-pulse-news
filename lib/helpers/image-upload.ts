"use client";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export interface UploadImageOptions {
  /** Optional custom endpoint (default: /api/admin/upload) */
  endpoint?: string;
}

export interface UploadImageResult {
  url: string;
  path: string;
}

/**
 * Upload a single file to the admin upload API.
 * Validates type and size before uploading.
 */
export async function uploadImageFile(
  file: File,
  options: UploadImageOptions = {}
): Promise<UploadImageResult> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Invalid file type. Use JPEG, PNG, WebP or GIF.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("File too large. Max 5MB.");
  }

  const formData = new FormData();
  formData.set("file", file);
  const endpoint = options.endpoint ?? "/api/admin/upload";
  const res = await fetch(endpoint, { method: "POST", body: formData });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error ?? "Upload failed");
  }
  if (!data.url) {
    throw new Error("No URL returned from upload");
  }
  return { url: data.url, path: data.path ?? "" };
}

/**
 * Upload multiple files; returns URLs in order.
 */
export async function uploadImageFiles(
  files: File[],
  options?: UploadImageOptions
): Promise<UploadImageResult[]> {
  const results: UploadImageResult[] = [];
  for (const file of files) {
    results.push(await uploadImageFile(file, options));
  }
  return results;
}
