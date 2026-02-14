import { NextResponse } from "next/server";
import { getAllSources } from "@/lib/db/sources";
import { jsonWithCache } from "@/lib/api/cache";

/**
 * Public API: list active sources only.
 * No authentication required. Used by public pages for filtering.
 */
export async function GET() {
  try {
    const sources = await getAllSources(true);
    return jsonWithCache(sources, { cache: { maxAge: 60 } });
  } catch (error) {
    console.error("[GET /api/sources]", error);
    return NextResponse.json(
      { error: "Failed to list sources" },
      { status: 500 }
    );
  }
}
