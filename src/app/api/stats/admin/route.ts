// ============================================================
// src/app/api/stats/admin/route.ts
// ============================================================
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, properties, bookings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, count, gte } from "drizzle-orm";


export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    firstOfMonth.setHours(0, 0, 0, 0);

    const [[{ total: totalUsers }], [{ total: totalOwners }], [{ total: totalTenants }], [{ total: totalProperties }], [{ total: totalBookings }], [{ total: newUsers }], [{ total: newProperties }]] = await Promise.all([
      db.select({ total: count() }).from(users),
      db.select({ total: count() }).from(users).where(eq(users.role, "owner")),
      db.select({ total: count() }).from(users).where(eq(users.role, "tenant")),
      db.select({ total: count() }).from(properties),
      db.select({ total: count() }).from(bookings),
      db.select({ total: count() }).from(users).where(gte(users.createdAt, firstOfMonth)),
      db.select({ total: count() }).from(properties).where(gte(properties.createdAt, firstOfMonth)),
    ]);

    return NextResponse.json({
      totalUsers: Number(totalUsers),
      totalOwners: Number(totalOwners),
      totalTenants: Number(totalTenants),
      totalProperties: Number(totalProperties),
      totalBookings: Number(totalBookings),
      newUsersThisMonth: Number(newUsers),
      newPropertiesThisMonth: Number(newProperties),
    });
  } catch (error) {
    console.error("[GET /api/stats/admin]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
