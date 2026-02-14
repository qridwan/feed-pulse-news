"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsFormSchema, type NewsFormData } from "@/lib/admin/news-form-schema";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TagSelector } from "@/components/admin/TagSelector";
import type { Source, Tag } from "@prisma/client";

export interface NewsFormProps {
	sources: Source[];
	tags?: Tag[];
	defaultValues?: Partial<NewsFormData>;
	onSubmit: (data: NewsFormData) => Promise<void>;
	submitLabel?: string;
	/** When set, shows a Cancel button linking to this href */
	cancelHref?: string;
}

export function NewsForm({
	sources,
	tags,
	defaultValues,
	onSubmit,
	submitLabel = "Save",
	cancelHref,
}: NewsFormProps) {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<NewsFormData>({
		resolver: zodResolver(newsFormSchema),
		defaultValues: {
			tagIds: [],
			status: "DRAFT",
			...defaultValues,
		},
	});

	useEffect(() => {
		if (!isDirty) return;
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
		};
		globalThis.addEventListener("beforeunload", handleBeforeUnload);
		return () => globalThis.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isDirty]);

	const titleLen = (watch("title") ?? "").length;
	const shortDescLen = (watch("shortDescription") ?? "").length;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
			<div>
				<label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1.5">
					Title *
				</label>
				<input
					id="title"
					{...register("title")}
					maxLength={201}
					className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
					placeholder="Article title"
				/>
				<div className="mt-1 flex justify-between text-xs text-neutral-500">
					<span>{errors.title?.message}</span>
					<span>{titleLen}/200</span>
				</div>
			</div>

			<div>
				<label htmlFor="publishedDate" className="block text-sm font-medium text-neutral-700 mb-1.5">
					Published Date *
				</label>
				<input
					id="publishedDate"
					type="datetime-local"
					{...register("publishedDate")}
					className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
				/>
				{errors.publishedDate && (
					<p className="mt-1 text-sm text-red-600">{errors.publishedDate.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="sourceId" className="block text-sm font-medium text-neutral-700 mb-1.5">
					Source
				</label>
				<select
					id="sourceId"
					{...register("sourceId")}
					className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
				>
					<option value="">Select source</option>
					{sources.map((s) => (
						<option key={s.id} value={s.id}>
							{s.name}
						</option>
					))}
				</select>
				{errors.sourceId && (
					<p className="mt-1 text-sm text-red-600">{errors.sourceId.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="newsLink" className="block text-sm font-medium text-neutral-700 mb-1.5">
					News Link (optional)
				</label>
				<input
					id="newsLink"
					type="url"
					{...register("newsLink")}
					placeholder="https://…"
					className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
				/>
				{errors.newsLink && (
					<p className="mt-1 text-sm text-red-600">{errors.newsLink.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="shortDescription" className="block text-sm font-medium text-neutral-700 mb-1.5">
					Short Description * (max 150 chars)
				</label>
				<textarea
					id="shortDescription"
					{...register("shortDescription")}
					maxLength={151}
					rows={3}
					className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent resize-none"
					placeholder="Brief summary"
				/>
				<div className="mt-1 flex justify-between text-xs text-neutral-500">
					<span>{errors.shortDescription?.message}</span>
					<span>{shortDescLen}/150</span>
				</div>
			</div>

			<fieldset className="space-y-1.5">
				<legend className="text-sm font-medium text-neutral-700">
					Full Content *
				</legend>
				<RichTextEditor
					value={watch("fullContent") ?? ""}
					onChange={(html) => setValue("fullContent", html, { shouldValidate: true })}
					placeholder="Write content…"
				/>
				{errors.fullContent && (
					<p className="mt-1 text-sm text-red-600">{errors.fullContent.message}</p>
				)}
			</fieldset>

			<div>
				<ImageUploader
					label="Thumbnail Image *"
					bucket="news-images"
					maxFiles={1}
					value={watch("thumbnailUrl") ?? ""}
					onUpload={(urls) => setValue("thumbnailUrl", urls[0] ?? "", { shouldValidate: true })}
					error={errors.thumbnailUrl?.message}
					disabled={isSubmitting}
				/>
			</div>

			<div>
				<ImageUploader
					label="Additional Images (optional)"
					bucket="news-images"
					maxFiles={10}
					value={(watch("additionalImages") ?? "").split(",").filter(Boolean)}
					onUpload={(urls) => setValue("additionalImages", urls.length ? urls.join(",") : undefined)}
					disabled={isSubmitting}
				/>
			</div>

			<fieldset className="space-y-1.5">
				<legend className="text-sm font-medium text-neutral-700">
					Tags
				</legend>
				<TagSelector
					tags={(tags ?? []).map((t) => ({ id: t.id, name: t.name, slug: t.slug }))}
					value={watch("tagIds") ?? []}
					onChange={(ids) => setValue("tagIds", ids)}
					disabled={isSubmitting}
				/>
			</fieldset>

			<div>
				<span className="block text-sm font-medium text-neutral-700 mb-2">Status</span>
				<div className="flex gap-6">
					<label className="flex items-center gap-2 cursor-pointer">
						<input type="radio" value="DRAFT" {...register("status")} className="rounded-full" />
						<span className="text-sm text-neutral-700">Draft</span>
					</label>
					<label className="flex items-center gap-2 cursor-pointer">
						<input type="radio" value="PUBLISHED" {...register("status")} className="rounded-full" />
						<span className="text-sm text-neutral-700">Published</span>
					</label>
				</div>
			</div>

			<div className="flex gap-3 pt-2">
				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
				>
					{isSubmitting && (
						<span
							className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
							aria-hidden
						/>
					)}
					{submitLabel}
				</button>
				{cancelHref && (
					<Link
						href={cancelHref}
						className="rounded-xl px-6 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
					>
						Cancel
					</Link>
				)}
			</div>
		</form>
	);
}
