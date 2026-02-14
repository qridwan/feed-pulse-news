import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getSourceByIdWithNewsCount,
  updateSource,
  deleteSource,
} from "@/lib/db/sources";
import { prisma } from "@/lib/prisma";
import { updateSourceBodySchema } from "@/lib/validations/source";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const source = await getSourceByIdWithNewsCount(id);

    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    return NextResponse.json(source);
  } catch (error) {
    console.error("[GET /api/admin/sources/[id]]", error);
    return NextResponse.json(
      { error: "Failed to get source" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await getSourceByIdWithNewsCount(id);
    if (!existing) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
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

    const parsed = updateSourceBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.name !== undefined || data.slug !== undefined) {
      const name = (data.name ?? existing.name).trim();
      const slug = data.slug?.trim() ?? existing.slug;
      const conflict = await prisma.source.findFirst({
        where: {
          id: { not: id },
          OR: [{ name }, { slug }],
        },
      });
      if (conflict) {
        if (conflict.name === name) {
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
    }

    const source = await updateSource(id, {
      name: data.name?.trim(),
      slug: data.slug?.trim(),
      website: data.website?.trim() ?? undefined,
      logoUrl: data.logoUrl ?? undefined,
      description: data.description ?? undefined,
      isActive: data.isActive,
    });

    return NextResponse.json(source);
  } catch (error) {
    console.error("[PUT /api/admin/sources/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update source" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const source = await getSourceByIdWithNewsCount(id);

    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    if (source._count.news > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete source with associated news",
          newsCount: source._count.news,
          message: `This source has ${source._count.news} news article(s). Reassign or remove them before deleting.`,
        },
        { status: 400 }
      );
    }

    await deleteSource(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/admin/sources/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete source" },
      { status: 500 }
    );
  }
}
