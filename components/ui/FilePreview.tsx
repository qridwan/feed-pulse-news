"use client";

import Image from "next/image";

export interface FilePreviewProps {
  /** Preview URL (object URL or uploaded URL) */
  url: string;
  /** File name for label */
  name?: string;
  /** File size in bytes, optional */
  size?: number;
  /** Show remove button */
  onRemove?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Status: idle, uploading, success, error */
  status?: "idle" | "uploading" | "success" | "error";
  /** Error message when status is error */
  errorMessage?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FilePreview({
  url,
  name,
  size,
  onRemove,
  disabled,
  status = "idle",
  errorMessage,
}: FilePreviewProps) {
  const isExternal = url.startsWith("http") && !url.startsWith("data:");

  return (
    <div className="relative group rounded-xl border border-neutral-200 bg-white overflow-hidden">
      <div className="relative aspect-video w-full min-h-[80px] bg-neutral-100">
        {url ? (
          <Image
            src={url}
            alt={name ?? "Preview"}
            fill
            className="object-cover"
            sizes="200px"
            unoptimized={!isExternal}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm">
            No preview
          </div>
        )}
        {status === "uploading" && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 bg-red-50/90 flex items-center justify-center p-2">
            <span className="text-xs text-red-700 text-center">
              {errorMessage ?? "Upload failed"}
            </span>
          </div>
        )}
      </div>
      {(name ?? size != null) && (
        <div className="p-2 border-t border-neutral-100 flex items-center justify-between gap-2 min-w-0">
          <span className="text-xs text-neutral-600 truncate" title={name}>
            {name}
          </span>
          {size != null && (
            <span className="text-xs text-neutral-400 shrink-0">
              {formatSize(size)}
            </span>
          )}
        </div>
      )}
      {onRemove && !disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 rounded-lg bg-black/50 text-white p-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Remove"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
