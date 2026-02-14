import { z } from "zod";

export const sourceFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be at most 200 characters"),
  slug: z
    .string()
    .max(200, "Slug must be at most 200 characters")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  website: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.string().url("Enter a valid URL").optional()
  ),
  logoUrl: z.string().optional(),
  description: z.string().max(300, "Description must be at most 300 characters").optional(),
  isActive: z.boolean(),
});

export type SourceFormData = z.infer<typeof sourceFormSchema>;
