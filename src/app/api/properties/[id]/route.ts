// ============================================================
// src/app/api/properties/[id]/route.ts
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { properties, favorites, propertyViews } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { parseImages } from "@/lib/utils";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const property = await db.query.properties.findFirst({
      where: eq(properties.id, id),
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    // Increment view count (fire & forget)
    db.update(properties)
      .set({ viewCount: property.viewCount + 1 })
      .where(eq(properties.id, id))
      .then(() => {
        if (session?.user?.id) {
          db.insert(propertyViews)
            .values({ propertyId: id, userId: session.user.id })
            .catch(() => {});
        }
      })
      .catch(() => {});

    // Check if favorited
    let isFavorited = false;
    if (session?.user?.id) {
      const fav = await db.query.favorites.findFirst({
        where: and(
          eq(favorites.userId, session.user.id),
          eq(favorites.propertyId, id)
        ),
      });
      isFavorited = !!fav;
    }

    return NextResponse.json({
      ...property,
      images: parseImages(property.images),
      price: Number(property.price),
      latitude: Number(property.latitude),
      longitude: Number(property.longitude),
      isFavorited,
    });
  } catch (error) {
    console.error("[GET /api/properties/[id]]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

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

    const property = await db.query.properties.findFirst({
      where: eq(properties.id, id),
    });

    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    // Only owner or admin can update
    if (property.ownerId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updateData: Record<string, unknown> = {
      ...body,
      updatedAt: new Date(),
    };

    if (body.images) updateData.images = JSON.stringify(body.images);
    if (body.price) updateData.price = String(body.price);
    if (body.latitude) updateData.latitude = String(body.latitude);
    if (body.longitude) updateData.longitude = String(body.longitude);

    const [updated] = await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, id))
      .returning();

    return NextResponse.json({
      ...updated,
      images: parseImages(updated.images),
      price: Number(updated.price),
      latitude: Number(updated.latitude),
      longitude: Number(updated.longitude),
    });
  } catch (error) {
    console.error("[PATCH /api/properties/[id]]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const property = await db.query.properties.findFirst({
      where: eq(properties.id, id),
    });

    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    if (property.ownerId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await db.delete(properties).where(eq(properties.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/properties/[id]]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
