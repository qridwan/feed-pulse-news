# Supabase storage buckets

Create these buckets in **Supabase Dashboard → Storage** so uploads and public URLs work.

## Buckets

| Bucket          | Purpose              | Suggested policy        |
|-----------------|----------------------|--------------------------|
| `news-images`   | News article images  | Public read; auth write  |
| `source-logos`  | Source branding logos| Public read; auth write  |

## Setup

1. Open your project in [Supabase Dashboard](https://supabase.com/dashboard) → **Storage**.
2. Click **New bucket**.
3. Create:
   - **Name:** `news-images` → enable **Public bucket** if you want direct public URLs.
   - **Name:** `source-logos` → same as above.
4. Under **Policies**, add policies so that:
   - **Public read:** Anyone can read (if bucket is public, this is automatic).
   - **Authenticated or service write:** Only your app (using the service role key in API routes) can upload/delete.

## Usage in code

- **Upload:** Use `uploadImage(file, bucket, path)` from `@/lib/supabase/storage` in API routes or Server Actions (server-only).
- **Delete:** Use `deleteImage(bucket, path)`.
- **Public URL:** Use `getPublicUrl(bucket, path)` or `getResizedImageUrl` / `getWebPOptimizedUrl` for image transforms.

Bucket names are exported as `BUCKETS.NEWS_IMAGES` and `BUCKETS.SOURCE_LOGOS` from `@/lib/supabase/storage`.

## Image transformations

Resize and WebP-style optimization use [Supabase Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations). They may require a Pro plan. Use `getPublicUrlWithTransform`, `getResizedImageUrl`, or `getWebPOptimizedUrl` from `@/lib/supabase/storage`.
