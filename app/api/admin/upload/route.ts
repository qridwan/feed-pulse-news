import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { BUCKETS } from "@/lib/supabase/storage";
import {
  MAX_FILE_SIZE_BYTES,
  isAllowedBucket,
  isAllowedMimeType,
} from "@/lib/supabase/bucket-config";
import {
  uploadToSupabase,
  getPublicUrl,
} from "@/lib/supabase/storage-helpers";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing or invalid file" },
      { status: 400 },
    );
  }

  if (!isAllowedMimeType(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Use JPEG, PNG, WebP or GIF." },
      { status: 400 },
    );
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File too large. Max 5MB." },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpeg", "jpg", "png", "webp", "gif"].includes(ext)
    ? ext === "jpeg"
      ? "jpg"
      : ext
    : "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${safeExt}`;

  const bucketParam = request.nextUrl.searchParams.get("bucket");
  const bucket = bucketParam && isAllowedBucket(bucketParam)
    ? bucketParam
    : BUCKETS.NEWS_IMAGES;

  const buffer = await file.arrayBuffer();
  const { path: uploadedPath, error } = await uploadToSupabase(
    new File([buffer], file.name, { type: file.type }),
    bucket,
    path,
    { contentType: file.type },
  );

  if (error || !uploadedPath) {
    console.error("[upload]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const url = getPublicUrl(bucket, uploadedPath);
  return NextResponse.json({ url, path: uploadedPath });
}
