import { z } from "zod";

export const listNewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  source: z.string().min(1).optional(),
  sources: z.string().min(1).optional(), // comma-separated ids
  tag: z.string().min(1).optional(),
});

export type ListNewsQuery = z.infer<typeof listNewsQuerySchema>;

export function parseListNewsQuery(searchParams: URLSearchParams): ListNewsQuery {
  const raw = Object.fromEntries(searchParams.entries());
  return listNewsQuerySchema.parse(raw);
}
