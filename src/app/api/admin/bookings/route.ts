// ============================================================
// src/app/api/admin/bookings/route.ts
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc, count } from "drizzle-orm";
import { parseImages } from "@/lib/utils";


export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(50, Number(searchParams.get("pageSize") ?? 20));
    const offset = (page - 1) * pageSize;

    const [{ total }] = await db.select({ total: count() }).from(bookings);

    const rows = await db.query.bookings.findMany({
      orderBy: [desc(bookings.createdAt)],
      limit: pageSize,
      offset,
      with: {
        property: { columns: { id: true, title: true, images: true, city: true } },
        tenant: { columns: { id: true, name: true, email: true } },
        owner: { columns: { id: true, name: true } },
      },
    });

    const data = rows.map((b) => ({
      ...b,
      totalPrice: Number(b.totalPrice),
      property: b.property ? { ...b.property, images: parseImages(b.property.images) } : null,
    }));

    return NextResponse.json({
      data,
      total: Number(total),
      page,
      pageSize,
      totalPages: Math.ceil(Number(total) / pageSize),
    });
  } catch (error) {
    console.error("[GET /api/admin/bookings]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
