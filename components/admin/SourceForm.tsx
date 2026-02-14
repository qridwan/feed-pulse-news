"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sourceFormSchema, type SourceFormData } from "@/lib/admin/source-form-schema";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { slugify } from "@/lib/helpers/slug-generator";

export interface SourceFormProps {
  defaultValues?: Partial<SourceFormData>;
  /** For create: call with data only. */
  onSubmit?: (data: SourceFormData) => Promise<void>;
  /** For edit: pass editId and this action; form will call updateAction(editId, data). */
  editId?: string;
  updateAction?: (id: string, data: SourceFormData) => Promise<void>;
  submitLabel?: string;
  cancelHref?: string;
}

export function SourceForm({
  defaultValues,
  onSubmit,
  editId,
  updateAction,
  submitLabel = "Save",
  cancelHref,
}: SourceFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SourceFormData>({
    resolver: zodResolver(sourceFormSchema),
    defaultValues: {
      isActive: true,
      ...defaultValues,
    },
  });

  const handleSubmitForm = editId && updateAction
    ? (data: SourceFormData) => updateAction(editId, data)
    : onSubmit;

  async function onFormSubmit(data: SourceFormData) {
    if (!handleSubmitForm) return;
    setSubmitError(null);
    try {
      await handleSubmitForm(data);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  const name = watch("name") ?? "";
  const slugFromName = name ? slugify(name) : "";

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
          Name *
        </label>
        <input
          id="name"
          {...register("name")}
          maxLength={201}
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
          placeholder="Source name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-neutral-700 mb-1.5">
          Slug (optional, leave empty to auto-generate)
        </label>
        <input
          id="slug"
          {...register("slug")}
          maxLength={201}
          placeholder={slugFromName || "e.g. my-source"}
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-1.5">
          Website (optional)
        </label>
        <input
          id="website"
          type="url"
          {...register("website")}
          placeholder="https://…"
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
        )}
      </div>

      <div>
        <ImageUploader
          label="Logo (optional)"
          bucket="source-logos"
          maxFiles={1}
          value={watch("logoUrl") ?? ""}
          onUpload={(urls) => setValue("logoUrl", urls[0] ?? "", { shouldValidate: true })}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1.5">
          Description (optional, max 300 chars)
        </label>
        <textarea
          id="description"
          {...register("description")}
          maxLength={301}
          rows={3}
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent resize-none"
          placeholder="Brief description"
        />
        <div className="mt-1 flex justify-between text-xs text-neutral-500">
          <span>{errors.description?.message}</span>
          <span>{(watch("description") ?? "").length}/300</span>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("isActive")}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Active</span>
        </label>
      </div>

      {submitError && (
        <p className="text-sm text-red-600 rounded-xl bg-red-50 border border-red-200 px-4 py-3" role="alert">
          {submitError}
        </p>
      )}

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
