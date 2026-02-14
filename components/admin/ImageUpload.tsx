"use client";

import { useCallback, useState } from "react";
import { clsx } from "clsx";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  /** Single thumbnail (required in form) or multiple gallery */
  multiple?: boolean;
  /** Optional label */
  label?: string;
  /** Required for single thumbnail to show error */
  error?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  label,
  error,
  disabled,
}: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const urls = value ? (multiple ? value.split(",").filter(Boolean) : [value]) : [];

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.set("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }
    return data.url ?? null;
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || disabled) return;
      setUploadError(null);
      setUploading(true);
      try {
        const toUpload = Array.from(files).filter(
          (f) => ALLOWED.includes(f.type) && f.size <= MAX_SIZE
        );
        if (toUpload.length !== files.length) {
          setUploadError("Some files were skipped (type or size).");
        }
        const newUrls: string[] = [];
        for (const file of toUpload) {
          const url = await uploadFile(file);
          if (url) newUrls.push(url);
        }
        if (multiple) {
          onChange([...urls, ...newUrls].join(","));
        } else if (newUrls[0]) {
          onChange(newUrls[0]);
        }
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [disabled, multiple, onChange, uploadFile, urls]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const removeUrl = (url: string) => {
    if (multiple) {
      onChange(urls.filter((u) => u !== url).join(","));
    } else {
      onChange(null);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={clsx(
          "rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          dragging && "border-neutral-400 bg-neutral-50",
          !dragging && "border-neutral-200 bg-neutral-50/50",
          disabled && "opacity-60 pointer-events-none"
        )}
      >
        <input
          type="file"
          accept={ALLOWED.join(",")}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          id={label ? `upload-${label.replace(/\s/g, "-")}` : "upload"}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <label
          htmlFor={label ? `upload-${label.replace(/\s/g, "-")}` : "upload"}
          className="cursor-pointer block"
        >
          {uploading ? (
            <span className="text-sm text-neutral-500">Uploading…</span>
          ) : (
            <span className="text-sm text-neutral-600">
              Drag and drop or <span className="underline">browse</span> (JPEG, PNG, WebP, GIF, max 5MB)
            </span>
          )}
        </label>
      </div>
      {(error || uploadError) && (
        <p className="text-sm text-red-600">{error ?? uploadError}</p>
      )}
      {urls.length > 0 && (
        <div className={clsx("flex flex-wrap gap-3", multiple && "mt-3")}>
          {urls.map((url) => (
            <div
              key={url}
              className="relative group rounded-lg overflow-hidden border border-neutral-200 bg-white"
            >
              <img
                src={url}
                alt=""
                className="h-24 w-24 object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeUrl(url)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
