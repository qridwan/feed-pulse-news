# Supabase Storage Setup

This guide covers creating and configuring Supabase Storage buckets for SimplyNews (news images and source logos).

## 1. Create buckets

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Storage**.
2. Click **New bucket** and create:

| Bucket name       | Purpose                          | Public? |
|-------------------|----------------------------------|--------|
| `news-images`     | Article thumbnails and gallery   | Yes    |
| `source-logos`    | Source logos                     | Yes    |

- **Public bucket**: Enable **Public bucket** so files are readable via public URLs without signed tokens.
- Leave **File size limit** empty or set to **5 MB** (see [File size limits](#file-size-limits)).
- **Allowed MIME types**: Leave empty to allow the app to enforce types, or set to `image/jpeg, image/png, image/webp, image/gif`.

## 2. Bucket policies

Use **Storage** → **Policies** (or **SQL Editor**) to add RLS policies.

### Public read (for public buckets)

Anyone can read objects:

```sql
-- Policy: Public read for news-images
CREATE POLICY "Public read news-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'news-images' );

-- Policy: Public read for source-logos
CREATE POLICY "Public read source-logos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'source-logos' );
```

### Authenticated write (upload/delete)

Only authenticated users (or service role) can insert/update/delete. The app uses the **service role** for uploads from the admin API, so you can either:

**Option A – Service role only (recommended)**  
Do not add `INSERT`/`UPDATE`/`DELETE` policies for these buckets. The app uses the service role client, which bypasses RLS. Only your backend can upload/delete.

**Option B – Authenticated users**

```sql
-- Allow authenticated users to upload to news-images
CREATE POLICY "Authenticated upload news-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'news-images' );

-- Allow authenticated users to delete their uploads (optional)
CREATE POLICY "Authenticated delete news-images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'news-images' );
```

Repeat for `source-logos` if you want client-side uploads.

## 3. CORS configuration

If the browser will upload directly to Supabase (signed uploads), configure CORS in the Dashboard:

**Storage** → **Configuration** → **CORS** (or use **Settings** → **API** and set CORS there).

Example CORS for a Next.js app:

- **Allowed origins**: `https://yourdomain.com`, `http://localhost:3000`
- **Allowed methods**: `GET`, `PUT`, `POST`, `DELETE`, `HEAD`
- **Allowed headers**: `*` or list `Authorization`, `Content-Type`, `x-client-info`, etc.
- **Max age**: `3600`

For SimplyNews, uploads go through the Next.js API route (`/api/admin/upload`), so the browser does not call Supabase Storage directly. In that case, CORS for Storage is only needed if you add client-side direct uploads later.

## 4. File size limits

- **Recommended**: 5 MB per file for both buckets.
- Enforced in the app:
  - **API**: `app/api/admin/upload/route.ts` (5 MB).
  - **Config**: `lib/supabase/bucket-config.ts` (`maxSizeBytes`).
- In Supabase Dashboard you can set a **File size limit** (e.g. 5242880 for 5 MB) as a safeguard.

## 5. Allowed file types

- **Allowed types**: JPEG, PNG, WebP, GIF.
- **MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
- Enforced in the app in the upload API and in `bucket-config.ts` (`allowedMimeTypes`).
- Optionally restrict in Supabase bucket **Allowed MIME types** to the same list.

## 6. Environment variables

Ensure these are set (e.g. in `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

- **Service role key** is used by the server for upload/delete/list; never expose it to the client.

## 7. Usage in the app

- **Upload**: `POST /api/admin/upload` (multipart form, field `file`; optional query `bucket=news-images|source-logos`).
- **Helpers**: `lib/supabase/storage-helpers.ts` (`uploadToSupabase`, `deleteFromSupabase`, `getPublicUrl`, `listFiles`, `moveFile`).
- **Config**: `lib/supabase/bucket-config.ts` (bucket names, limits, allowed types).

## 8. Orphaned image cleanup

Images that are no longer referenced in the database (e.g. after deleting news or changing thumbnails) can be cleaned up with:

- **Script**: `lib/supabase/orphan-cleanup.ts` – lists objects, compares with DB references, deletes orphans.
- Run manually or from a cron job; see that file for usage and safety notes.
