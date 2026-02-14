import { NextRequest, NextResponse } from "next/server";
import { getNewsBySlug, incrementViewCount } from "@/lib/db/news";
import { Status } from "@prisma/client";
import { jsonWithCache } from "@/lib/api/cache";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug?.trim()) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    const news = await getNewsBySlug(slug);
    if (!news || news.status !== Status.PUBLISHED) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await incrementViewCount(slug);

    return jsonWithCache(
      {
        ...news,
        publishedDate: news.publishedDate.toISOString(),
        createdAt: news.createdAt.toISOString(),
        updatedAt: news.updatedAt.toISOString(),
      },
      { status: 200, cache: { maxAge: 60, staleWhileRevalidate: 120 } }
    );
  } catch (error) {
    console.error("[GET /api/news/[slug]]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
