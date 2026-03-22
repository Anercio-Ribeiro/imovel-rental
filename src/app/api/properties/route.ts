// ============================================================
// src/app/api/properties/route.ts — List & Create properties
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { properties, favorites } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, gte, lte, ilike, or, desc, asc, count, sql } from "drizzle-orm";
import { parseImages } from "@/lib/utils";
import type { PropertyFilters } from "@/types";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await auth();

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 8)));
    const offset = (page - 1) * pageSize;

    // Filters
    const search = searchParams.get("search") ?? undefined;
    const city = searchParams.get("city") ?? undefined;
    const type = searchParams.get("type") ?? undefined;
    const listingType = searchParams.get("listingType") ?? undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const bedrooms = searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined;
    const bathrooms = searchParams.get("bathrooms") ? Number(searchParams.get("bathrooms")) : undefined;
    const furnished = searchParams.get("furnished") === "true" ? true : undefined;
    const petFriendly = searchParams.get("petFriendly") === "true" ? true : undefined;
    const sortBy = searchParams.get("sortBy") ?? "newest";

    // Build WHERE conditions
    const conditions = [eq(properties.status, "active")];

    if (search) {
      conditions.push(
        or(
          ilike(properties.title, `%${search}%`),
          ilike(properties.titleEn, `%${search}%`),
          ilike(properties.address, `%${search}%`),
          ilike(properties.city, `%${search}%`)
        )!
      );
    }
    if (city) conditions.push(ilike(properties.city, `%${city}%`));
    if (type) conditions.push(eq(properties.type, type as never));
    if (listingType) conditions.push(eq(properties.listingType, listingType as never));
    if (minPrice !== undefined) conditions.push(gte(properties.price, String(minPrice)));
    if (maxPrice !== undefined) conditions.push(lte(properties.price, String(maxPrice)));
    if (bedrooms !== undefined) conditions.push(eq(properties.bedrooms, bedrooms));
    if (bathrooms !== undefined) conditions.push(eq(properties.bathrooms, bathrooms));
    if (furnished !== undefined) conditions.push(eq(properties.furnished, furnished));
    if (petFriendly !== undefined) conditions.push(eq(properties.petFriendly, petFriendly));

    const where = and(...conditions);

    // Sort
    const orderBy = (() => {
      switch (sortBy) {
        case "price_asc": return [asc(properties.price)];
        case "price_desc": return [desc(properties.price)];
        case "most_viewed": return [desc(properties.viewCount)];
        default: return [desc(properties.createdAt)];
      }
    })();

    // Count query
    const [{ total }] = await db
      .select({ total: count() })
      .from(properties)
      .where(where);

    // Data query with owner join
    const rows = await db.query.properties.findMany({
      where,
      orderBy,
      limit: pageSize,
      offset,
      with: {
        owner: {
          columns: { id: true, name: true, avatar: true, phone: true, email: true },
        },
      },
    });

    // Get favorites for logged-in user
    let favoriteIds = new Set<string>();
    if (session?.user?.id) {
      const userFavorites = await db
        .select({ propertyId: favorites.propertyId })
        .from(favorites)
        .where(eq(favorites.userId, session.user.id));
      favoriteIds = new Set(userFavorites.map((f) => f.propertyId));
    }

    const data = rows.map((p) => ({
      ...p,
      images: parseImages(p.images),
      price: Number(p.price),
      latitude: Number(p.latitude),
      longitude: Number(p.longitude),
      isFavorited: favoriteIds.has(p.id),
    }));

    return NextResponse.json({
      data,
      total: Number(total),
      page,
      pageSize,
      totalPages: Math.ceil(Number(total) / pageSize),
    });
  } catch (error) {
    console.error("[GET /api/properties]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "owner" && session.user.role !== "admin") {
      return NextResponse.json({ message: "Only owners can create properties" }, { status: 403 });
    }

    const body = await req.json();

    const [newProperty] = await db
      .insert(properties)
      .values({
        ...body,
        images: JSON.stringify(body.images ?? []),
        price: String(body.price),
        latitude: String(body.latitude),
        longitude: String(body.longitude),
        ownerId: session.user.id,
        status: "active",
      })
      .returning();

    return NextResponse.json(
      { ...newProperty, images: parseImages(newProperty.images) },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/properties]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
