"use client";

export interface UploadProgressProps {
  /** 0–100 */
  percent: number;
  /** Optional label (e.g. "Uploading 2 of 5…") */
  label?: string;
  /** Accessibility: announce to screen readers */
  "aria-label"?: string;
  className?: string;
}

export function UploadProgress({
  percent,
  label,
  "aria-label": ariaLabel,
  className = "",
}: UploadProgressProps) {
  const value = Math.min(100, Math.max(0, percent));

  return (
    <div className={className} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={ariaLabel ?? label ?? "Upload progress"}>
      {label && (
        <p className="text-sm text-neutral-600 mb-1">{label}</p>
      )}
      <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
        <div
          className="h-full bg-neutral-700 rounded-full transition-[width] duration-200"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
