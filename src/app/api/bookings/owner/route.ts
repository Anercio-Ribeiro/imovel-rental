// ============================================================
// src/app/api/bookings/owner/route.ts
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
    if (session.user.role !== "owner" && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const rows = await db.query.bookings.findMany({
      where: eq(bookings.ownerId, session.user.id),
      orderBy: [desc(bookings.createdAt)],
      with: {
        property: {
          columns: {
            id: true, title: true, titleEn: true, images: true,
            city: true, address: true,
          },
        },
        tenant: {
          columns: { id: true, name: true, email: true, phone: true, avatar: true },
        },
      },
    });

    const data = rows.map((b) => ({
      ...b,
      totalPrice: Number(b.totalPrice),
      property: b.property
        ? { ...b.property, images: parseImages(b.property.images) }
        : null,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/bookings/owner]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
