import { NextRequest, NextResponse } from "next/server";
import { getPublishedNews } from "@/lib/db/news";
import { jsonWithCache } from "@/lib/api/cache";
import { listNewsQuerySchema } from "@/lib/api/news-schemas";

function parseDate(value: string): Date | null {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = listNewsQuerySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { page, limit, startDate, endDate, source, sources, tag } = parsed.data;
    const dateFrom = startDate ? parseDate(startDate) : undefined;
    const dateTo = endDate ? parseDate(endDate) : undefined;

    if (startDate && !dateFrom) {
      return NextResponse.json(
        { error: "Invalid startDate format" },
        { status: 400 }
      );
    }
    if (endDate && !dateTo) {
      return NextResponse.json(
        { error: "Invalid endDate format" },
        { status: 400 }
      );
    }

    const sourceIds = sources
      ? sources.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;
    const isUuid = source && /^[0-9a-f-]{36}$/i.test(source);
    const result = await getPublishedNews({
      page,
      pageSize: limit,
      dateFrom: dateFrom ?? undefined,
      dateTo: dateTo ?? undefined,
      ...(sourceIds?.length && { sourceIds }),
      ...(!sourceIds?.length && source && (isUuid ? { sourceId: source } : { sourceSlug: source })),
      tagSlug: tag || undefined,
    });

    return jsonWithCache(
      {
        items: result.items,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
      },
      { status: 200, cache: { maxAge: 60, staleWhileRevalidate: 120 } }
    );
  } catch (error) {
    console.error("[GET /api/news]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
