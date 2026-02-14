import { z } from "zod";

export const newsFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  publishedDate: z.string().min(1, "Published date is required"),
  sourceId: z.string().min(1, "Source is required"),
  newsLink: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.string().url("Enter a valid URL").optional()
  ),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(150, "Short description must be at most 150 characters"),
  fullContent: z.string().min(1, "Content is required"),
  thumbnailUrl: z.string().min(1, "Thumbnail image is required"),
  additionalImages: z.string().optional(), // comma-separated URLs
  tagIds: z.array(z.string()),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type NewsFormData = z.infer<typeof newsFormSchema>;

export const NEWS_FORM_DEFAULTS: Partial<NewsFormData> = {
  tagIds: [],
  status: "DRAFT",
};
