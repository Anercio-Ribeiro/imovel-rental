// ============================================================
// src/app/api/bookings/[id]/route.ts — Update booking status
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
    });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    const body = await req.json();
    const { status } = body as { status: string };

    // Validate transitions
    const isOwner = booking.ownerId === session.user.id;
    const isTenant = booking.tenantId === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isTenant && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Owner can approve/reject; tenant can cancel; admin can do anything
    const allowed = isAdmin
      ? ["approved", "rejected", "cancelled", "completed"]
      : isOwner
      ? ["approved", "rejected"]
      : ["cancelled"];

    if (!allowed.includes(status)) {
      return NextResponse.json(
        { message: `Cannot set status '${status}'` },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(bookings)
      .set({ status: status as never, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();

    return NextResponse.json({ ...updated, totalPrice: Number(updated.totalPrice) });
  } catch (error) {
    console.error("[PATCH /api/bookings/[id]]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
