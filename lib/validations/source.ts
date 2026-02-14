import { z } from "zod";

/** Admin list sources query params */
export const listAdminSourcesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
  active: z.enum(["true", "false", ""]).optional(),
  sortBy: z.enum(["name", "newsCount"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type ListAdminSourcesQuery = z.infer<typeof listAdminSourcesQuerySchema>;

/** Create source body */
export const createSourceBodySchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be at most 200 characters"),
  slug: z.string().max(200).optional(),
  website: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.string().url("Enter a valid URL").optional()
  ),
  logoUrl: z.string().url().optional().nullable(),
  description: z.string().max(300).optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CreateSourceBody = z.infer<typeof createSourceBodySchema>;

/** Update source body (all fields optional) */
export const updateSourceBodySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().max(200).optional(),
  website: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.string().url().optional()
  ),
  logoUrl: z.string().url().optional().nullable(),
  description: z.string().max(300).optional().nullable(),
  isActive: z.boolean().optional(),
});

export type UpdateSourceBody = z.infer<typeof updateSourceBodySchema>;
