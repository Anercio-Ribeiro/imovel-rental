// ============================================================
// src/app/api/bookings/route.ts — Create booking
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, properties } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { calculateNights } from "@/lib/utils";


export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role === "owner") {
      return NextResponse.json(
        { message: "Owners cannot make bookings. Use a tenant account." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { propertyId, startDate, endDate, message } = body;

    if (!propertyId || !startDate || !endDate) {
      return NextResponse.json(
        { message: "propertyId, startDate and endDate are required" },
        { status: 400 }
      );
    }

    const property = await db.query.properties.findFirst({
      where: eq(properties.id, propertyId),
    });

    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }
    if (property.status !== "active") {
      return NextResponse.json({ message: "Property is not available" }, { status: 400 });
    }
    if (property.ownerId === session.user.id) {
      return NextResponse.json(
        { message: "You cannot book your own property" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = calculateNights(start, end);

    if (nights <= 0) {
      return NextResponse.json({ message: "Invalid dates" }, { status: 400 });
    }

    const pricePerDay = Number(property.price) / 30;
    const totalPrice = property.priceUnit === "month"
      ? pricePerDay * nights
      : Number(property.price);

    const [booking] = await db
      .insert(bookings)
      .values({
        propertyId,
        tenantId: session.user.id,
        ownerId: property.ownerId,
        startDate: start,
        endDate: end,
        message: message ?? null,
        status: "pending",
        totalPrice: String(totalPrice.toFixed(2)),
        nights,
      })
      .returning();

    // Update booking count on property
    await db
      .update(properties)
      .set({ bookingCount: property.bookingCount + 1 })
      .where(eq(properties.id, propertyId));

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("[POST /api/bookings]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
