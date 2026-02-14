import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAdminSources, createSource, generateUniqueSourceSlug } from "@/lib/db/sources";
import { prisma } from "@/lib/prisma";
import {
  listAdminSourcesQuerySchema,
  createSourceBodySchema,
} from "@/lib/validations/source";
import type { AdminSourceFilters } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = listAdminSourcesQuerySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { page, pageSize, search, active, sortBy, sortOrder } = parsed.data;
    const filters: AdminSourceFilters = {
      page,
      pageSize,
      search: search || undefined,
      active: active === "" ? undefined : active,
      sortBy,
      sortOrder,
    };

    const result = await getAdminSources(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/admin/sources]", error);
    return NextResponse.json(
      { error: "Failed to list sources" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parsed = createSourceBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const name = data.name.trim();
    const slug = data.slug?.trim() || (await generateUniqueSourceSlug(name));

    const existing = await prisma.source.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existing) {
      if (existing.name === name) {
        return NextResponse.json(
          { error: "A source with this name already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "A source with this slug already exists" },
        { status: 409 }
      );
    }

    const website = data.website?.trim() ?? "";
    const source = await createSource({
      name,
      slug,
      website,
      logoUrl: data.logoUrl ?? null,
      description: data.description ?? null,
      isActive: data.isActive ?? true,
    });

    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/sources]", error);
    return NextResponse.json(
      { error: "Failed to create source" },
      { status: 500 }
    );
  }
}
