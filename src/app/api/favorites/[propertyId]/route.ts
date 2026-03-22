// ============================================================
// src/app/api/favorites/[propertyId]/route.ts
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { favorites } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";


export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, session.user.id),
          eq(favorites.propertyId, propertyId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/favorites/[propertyId]]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
