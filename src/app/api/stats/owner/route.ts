// ============================================================
// src/app/api/stats/owner/route.ts
// ============================================================
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { properties, bookings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, sum, count, desc } from "drizzle-orm";
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

    const ownerId = session.user.id;

    // Total properties
    const [{ total: totalProperties }] = await db
      .select({ total: count() })
      .from(properties)
      .where(eq(properties.ownerId, ownerId));

    // Active properties
    const [{ total: activeProperties }] = await db
      .select({ total: count() })
      .from(properties)
      .where(and(eq(properties.ownerId, ownerId), eq(properties.status, "active")));

    // Aggregate views and bookings from properties
    const allProps = await db.query.properties.findMany({
      where: eq(properties.ownerId, ownerId),
    });
    const totalViews = allProps.reduce((s, p) => s + p.viewCount, 0);
    const totalBookings = allProps.reduce((s, p) => s + p.bookingCount, 0);

    // Pending bookings
    const [{ total: pendingBookings }] = await db
      .select({ total: count() })
      .from(bookings)
      .where(and(eq(bookings.ownerId, ownerId), eq(bookings.status, "pending")));

    // Approved bookings
    const [{ total: approvedBookings }] = await db
      .select({ total: count() })
      .from(bookings)
      .where(and(eq(bookings.ownerId, ownerId), eq(bookings.status, "approved")));

    // Monthly revenue (approved bookings this month)
    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    firstOfMonth.setHours(0, 0, 0, 0);

    const approvedThisMonth = await db.query.bookings.findMany({
      where: and(eq(bookings.ownerId, ownerId), eq(bookings.status, "approved")),
    });
    const monthlyRevenue = approvedThisMonth
      .filter((b) => new Date(b.createdAt) >= firstOfMonth)
      .reduce((s, b) => s + Number(b.totalPrice), 0);

    // Top 5 most viewed
    const topViewed = await db.query.properties.findMany({
      where: eq(properties.ownerId, ownerId),
      orderBy: [desc(properties.viewCount)],
      limit: 5,
    });

    // Top 5 most booked
    const topBooked = await db.query.properties.findMany({
      where: eq(properties.ownerId, ownerId),
      orderBy: [desc(properties.bookingCount)],
      limit: 5,
    });

    // Views by last 6 months (mocked aggregation)
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
    const viewsByMonth = months.map((month, i) => ({
      month,
      views: Math.round((totalViews / 6) * (0.6 + Math.random() * 0.8)),
    }));
    const bookingsByMonth = months.map((month, i) => ({
      month,
      bookings: Math.round((totalBookings / 6) * (0.6 + Math.random() * 0.8)),
    }));

    return NextResponse.json({
      totalProperties: Number(totalProperties),
      activeProperties: Number(activeProperties),
      totalViews,
      totalBookings,
      pendingBookings: Number(pendingBookings),
      approvedBookings: Number(approvedBookings),
      monthlyRevenue,
      topProperties: topViewed.map((p) => ({
        ...p,
        images: parseImages(p.images),
        price: Number(p.price),
      })),
      topBooked: topBooked.map((p) => ({
        ...p,
        images: parseImages(p.images),
        price: Number(p.price),
      })),
      viewsByMonth,
      bookingsByMonth,
    });
  } catch (error) {
    console.error("[GET /api/stats/owner]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
