"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { FilePreview } from "@/components/ui/FilePreview";
import { UploadProgress } from "@/components/ui/UploadProgress";

const DEFAULT_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const DEFAULT_MAX_SIZE_MB = 1;
const DEFAULT_MAX_FILES = 3;

export type ImageUploaderBucket = "news-images" | "source-logos";

export interface ImageUploaderProps {
	/** Called with array of uploaded URLs when uploads complete (including existing when removed) */
	onUpload: (urls: string[]) => void;
	/** Existing URL(s) to show (e.g. when editing). Single string or array. */
	value?: string | string[] | null;
	/** Max number of files (default 10) */
	maxFiles?: number;
	/** Max file size in MB (default 5) */
	maxSize?: number;
	/** Accept string for input (default image types) */
	accept?: string;
	/** Storage bucket - passed to API if endpoint supports it */
	bucket?: ImageUploaderBucket;
	/** Disabled */
	disabled?: boolean;
	/** Optional label */
	label?: string;
	/** Validation error (e.g. "Thumbnail is required") */
	error?: string;
}

type FileState = {
	id: string;
	file: File;
	preview: string;
	status: "idle" | "uploading" | "success" | "error";
	url?: string;
	error?: string;
};

function normalizeValue(value: string | string[] | null | undefined): string[] {
	if (value == null) return [];
	if (Array.isArray(value)) return value.filter(Boolean);
	return value.trim() ? [value.trim()] : [];
}

export function ImageUploader({
	onUpload,
	value,
	maxFiles = DEFAULT_MAX_FILES,
	maxSize = DEFAULT_MAX_SIZE_MB,
	accept = DEFAULT_ACCEPT,
	bucket = "news-images",
	disabled,
	label,
	error: externalError,
}: ImageUploaderProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [files, setFiles] = useState<FileState[]>([]);
	const [existingUrls, setExistingUrls] = useState<string[]>(() => normalizeValue(value));
	const [dragging, setDragging] = useState(false);
	const [globalError, setGlobalError] = useState<string | null>(null);

	useEffect(() => {
		setExistingUrls(normalizeValue(value));
	}, [value]);

	const maxBytes = maxSize * 1024 * 1024;
	const acceptTypes = accept.split(",").map((s) => s.trim());

	const validateFile = useCallback(
		(file: File): string | null => {
			if (file.size > maxBytes) {
				return `File too large (max ${maxSize} MB)`;
			}
			const type = file.type?.toLowerCase();
			const allowed = acceptTypes.some(
				(a) => type === a || a.endsWith("/*") && type.startsWith(a.replace("/*", "/"))
			);
			if (!allowed) {
				return "Invalid file type";
			}
			return null;
		},
		[maxBytes, maxSize, acceptTypes]
	);

	const uploadOne = useCallback(async (file: File): Promise<string> => {
		const formData = new FormData();
		formData.set("file", file);
		const url = new URL("/api/admin/upload", window.location.origin);
		if (bucket) url.searchParams.set("bucket", bucket);
		const res = await fetch(url.toString(), { method: "POST", body: formData });
		const data = await res.json().catch(() => ({}));
		if (!res.ok) throw new Error(data.error ?? "Upload failed");
		if (!data.url) throw new Error("No URL returned");
		return data.url;
	}, [bucket]);

	const processFiles = useCallback(
		async (newFiles: File[]) => {
			const valid: File[] = [];
			const errors: string[] = [];
			for (const file of newFiles) {
				const err = validateFile(file);
				if (err) errors.push(`${file.name}: ${err}`);
				else valid.push(file);
			}
			if (errors.length) setGlobalError(errors.slice(0, 3).join("; "));
			if (valid.length === 0) return;

			const currentTotal = existingUrls.length + files.length;
			const remaining = maxFiles - currentTotal;
			const toAdd = valid.slice(0, Math.max(0, remaining));
			if (toAdd.length < valid.length) {
				setGlobalError((e) => (e ? `${e}. ` : "") + "Max files reached.");
			}

			const newStates: FileState[] = toAdd.map((file) => ({
				id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
				file,
				preview: URL.createObjectURL(file),
				status: "uploading" as const,
			}));
			setFiles((prev) => [...prev, ...newStates]);
			setGlobalError(null);

			const results: string[] = [];
			for (const element of newStates) {
				const state = element;
				try {
					const url = await uploadOne(state.file);
					results.push(url);
					setFiles((prev) =>
						prev.map((f) =>
							f.id === state.id ? { ...f, status: "success" as const, url } : f
						)
					);
				} catch (e) {
					setFiles((prev) =>
						prev.map((f) =>
							f.id === state.id
								? {
									...f,
									status: "error" as const,
									error: e instanceof Error ? e.message : "Upload failed",
								}
								: f
						)
					);
				}
			}

			const newUrls = [...files.filter((f) => f.url).map((f) => f.url!), ...results];
			onUpload([...existingUrls, ...newUrls]);
		},
		[existingUrls, files, maxFiles, validateFile, uploadOne, onUpload]
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const list = e.target.files;
			if (!list?.length) return;
			processFiles(Array.from(list));
			e.target.value = "";
		},
		[processFiles]
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setDragging(false);
			if (disabled) return;
			const list = e.dataTransfer.files;
			if (list?.length) processFiles(Array.from(list));
		},
		[disabled, processFiles]
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setDragging(false);
	}, []);

	const handlePaste = useCallback(
		(e: React.ClipboardEvent) => {
			if (disabled) return;
			const items = e.clipboardData?.files;
			if (!items?.length) return;
			const imageFiles = Array.from(items).filter((f) => f.type.startsWith("image/"));
			if (imageFiles.length) {
				e.preventDefault();
				processFiles(imageFiles);
			}
		},
		[disabled, processFiles]
	);

	const removeFile = useCallback(
		(id: string) => {
			if (id.startsWith("existing-")) {
				const url = id.replace(/^existing-/, "");
				setExistingUrls((prev) => {
					const next = prev.filter((u) => u !== url);
					onUpload([...next, ...files.filter((f) => f.url).map((f) => f.url!)]);
					return next;
				});
				return;
			}
			setFiles((prev) => {
				const item = prev.find((f) => f.id === id);
				if (item?.preview.startsWith("blob:")) URL.revokeObjectURL(item.preview);
				const next = prev.filter((f) => f.id !== id);
				const urls = [...existingUrls, ...next.filter((f) => f.url).map((f) => f.url!)];
				onUpload(urls);
				return next;
			});
		},
		[existingUrls, files, onUpload]
	);

	const filesRef = useRef(files);
	filesRef.current = files;
	useEffect(() => {
		return () => {
			filesRef.current.forEach((f) => {
				if (f.preview.startsWith("blob:")) URL.revokeObjectURL(f.preview);
			});
		};
	}, []);

	const uploadingCount = files.filter((f) => f.status === "uploading").length;
	const totalUploading = files.length;
	const totalCount = existingUrls.length + files.length;
	const canAddMore = totalCount < maxFiles;

	return (
		<div
			className="space-y-4"
			onPaste={handlePaste}
			role="region"
			aria-label={label ?? "Image upload"}
		>
			{label && (
				<label className="block text-sm font-medium text-neutral-700">{label}</label>
			)}

			{canAddMore && (
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onClick={() => inputRef.current?.click()}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							inputRef.current?.click();
						}
					}}
					tabIndex={disabled ? -1 : 0}
					role="button"
					aria-label="Drop images or click to browse"
					className={clsx(
						"rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2",
						dragging && "border-neutral-400 bg-neutral-50",
						!dragging && "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300",
						disabled && "opacity-60 pointer-events-none"
					)}
				>
					<input
						ref={inputRef}
						type="file"
						accept={accept}
						multiple
						disabled={disabled}
						onChange={handleInputChange}
						className="hidden"
						aria-hidden
					/>
					<p className="text-sm text-neutral-600">
						Drag and drop images, paste from clipboard, or click to browse
					</p>
					<p className="mt-1 text-xs text-neutral-400">
						Max {maxSize} MB per file, up to {maxFiles} files. {acceptTypes.join(", ")}
					</p>
				</div>
			)}

			{uploadingCount > 0 && (
				<UploadProgress
					percent={totalUploading ? ((totalUploading - uploadingCount) / totalUploading) * 100 : 0}
					label={`Uploading ${totalUploading - uploadingCount} of ${totalUploading}…`}
				/>
			)}

			{(globalError || externalError) && (
				<p className="text-sm text-red-600" role="alert">
					{externalError ?? globalError}
				</p>
			)}

			{(existingUrls.length > 0 || files.length > 0) && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{existingUrls.map((url) => (
						<FilePreview
							key={`existing-${url}`}
							url={url}
							name="Image"
							status="success"
							onRemove={() => removeFile(`existing-${url}`)}
							disabled={disabled}
						/>
					))}
					{files.map((f) => (
						<FilePreview
							key={f.id}
							url={f.status === "success" && f.url ? f.url : f.preview}
							name={f.file.name}
							size={f.file.size}
							status={f.status}
							errorMessage={f.error}
							onRemove={() => removeFile(f.id)}
							disabled={disabled}
						/>
					))}
				</div>
			)}
		</div>
	);
}
