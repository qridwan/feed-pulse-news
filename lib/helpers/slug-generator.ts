/**
 * Client-side slug generator for display or prefill.
 * For unique slugs when saving, use server-side generateUniqueSlug().
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/(-)+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 200);
}
