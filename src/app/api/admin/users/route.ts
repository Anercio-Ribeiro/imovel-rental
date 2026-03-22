// ============================================================
// src/app/api/admin/users/route.ts
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc, count } from "drizzle-orm";


async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  if (session.user.role !== "admin") return null;
  return session;
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(50, Number(searchParams.get("pageSize") ?? 20));
    const offset = (page - 1) * pageSize;

    const [{ total }] = await db.select({ total: count() }).from(users);
    const rows = await db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
      limit: pageSize,
      offset,
      columns: { password: false }, // never expose password hashes
    });

    return NextResponse.json({
      data: rows,
      total: Number(total),
      page,
      pageSize,
      totalPages: Math.ceil(Number(total) / pageSize),
    });
  } catch (error) {
    console.error("[GET /api/admin/users]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
