import { NextRequest, NextResponse } from "next/server";
import { incrementViewCount } from "@/lib/db/news";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug?.trim()) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  await incrementViewCount(slug);
  return NextResponse.json({ ok: true });
}
