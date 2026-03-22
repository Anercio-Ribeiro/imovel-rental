// ============================================================
// src/app/api/bookings/my/route.ts — Tenant's bookings
// ============================================================
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { parseImages } from "@/lib/utils";


export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const rows = await db.query.bookings.findMany({
      where: eq(bookings.tenantId, session.user.id),
      orderBy: [desc(bookings.createdAt)],
      with: {
        property: {
          columns: {
            id: true, title: true, titleEn: true, images: true,
            city: true, address: true, price: true, priceUnit: true,
          },
        },
      },
    });

    const data = rows.map((b) => ({
      ...b,
      totalPrice: Number(b.totalPrice),
      property: b.property
        ? { ...b.property, images: parseImages(b.property.images), price: Number(b.property.price) }
        : null,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/bookings/my]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
