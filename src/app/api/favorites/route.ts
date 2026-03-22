// ============================================================
// src/app/api/favorites/route.ts — Get & Toggle favorites
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { favorites, properties } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, desc } from "drizzle-orm";
import { parseImages } from "@/lib/utils";


export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const rows = await db.query.favorites.findMany({
      where: eq(favorites.userId, session.user.id),
      orderBy: [desc(favorites.createdAt)],
      with: {
        property: {
          with: {
            owner: {
              columns: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    const data = rows.map((f) => ({
      ...f,
      property: f.property
        ? {
            ...f.property,
            images: parseImages(f.property.images),
            price: Number(f.property.price),
            latitude: Number(f.property.latitude),
            longitude: Number(f.property.longitude),
            isFavorited: true,
          }
        : null,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/favorites]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // Only tenants can manage favorites
    if (session.user.role !== "tenant") {
      return NextResponse.json(
        { message: "Apenas inquilinos podem gerir favoritos" },
        { status: 403 }
      );
    }

    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json({ message: "propertyId is required" }, { status: 400 });
    }

    // Prevent adding own property (extra safety)
    const property = await db.query.properties.findFirst({
      where: eq(properties.id, propertyId),
      columns: { ownerId: true },
    });
    if (property?.ownerId === session.user.id) {
      return NextResponse.json({ message: "Não pode adicionar o seu próprio imóvel" }, { status: 400 });
    }

    // Toggle: if exists remove, else add
    const existing = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, session.user.id),
        eq(favorites.propertyId, propertyId)
      ),
    });

    if (existing) {
      await db.delete(favorites).where(eq(favorites.id, existing.id));
      return NextResponse.json({ favorited: false });
    } else {
      await db.insert(favorites).values({
        userId: session.user.id,
        propertyId,
      });
      return NextResponse.json({ favorited: true });
    }
  } catch (error) {
    console.error("[POST /api/favorites]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
