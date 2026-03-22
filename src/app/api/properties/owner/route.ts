// ============================================================
// src/app/api/properties/owner/route.ts — Owner's properties
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, count } from "drizzle-orm";
import { parseImages } from "@/lib/utils";


export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 8)));
    const offset = (page - 1) * pageSize;

    const ownerId = session.user.id;

    const [{ total }] = await db
      .select({ total: count() })
      .from(properties)
      .where(eq(properties.ownerId, ownerId));

    const rows = await db.query.properties.findMany({
      where: eq(properties.ownerId, ownerId),
      orderBy: [desc(properties.createdAt)],
      limit: pageSize,
      offset,
    });

    const data = rows.map((p) => ({
      ...p,
      images: parseImages(p.images),
      price: Number(p.price),
      latitude: Number(p.latitude),
      longitude: Number(p.longitude),
    }));

    return NextResponse.json({
      data,
      total: Number(total),
      page,
      pageSize,
      totalPages: Math.ceil(Number(total) / pageSize),
    });
  } catch (error) {
    console.error("[GET /api/properties/owner]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
