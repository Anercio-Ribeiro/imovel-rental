// src/app/api/users/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";


export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { password: false },
    });
    if (!user) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error("[GET /api/users/me]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const allowed = ["name", "phone", "avatar"] as const;
    const update: Record<string, string> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }
    const [updated] = await db
      .update(users)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(users.id, session.user.id))
      .returning({ id: users.id, name: users.name, email: users.email, phone: users.phone, avatar: users.avatar, role: users.role });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/users/me]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
