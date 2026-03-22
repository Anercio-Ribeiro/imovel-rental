// ============================================================
// src/app/(public)/properties/[id]/page.tsx — Property detail (Server)
// ============================================================
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { parseImages } from "@/lib/utils";
import { PropertyDetailClient } from "@/components/properties/PropertyDetailClient";
import { auth } from "@/lib/auth";
import { favorites } from "@/lib/db/schema";
import { and } from "drizzle-orm";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await db.query.properties.findFirst({
    where: eq(properties.id, id),
    columns: { title: true, description: true, images: true },
  });
  if (!property) return { title: "Not found" };
  const imgs = parseImages(property.images);
  return {
    title: property.title,
    description: property.description.slice(0, 160),
    openGraph: { images: imgs[0] ? [imgs[0]] : [] },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const property = await db.query.properties.findFirst({
    where: eq(properties.id, id),
    with: {
      owner: {
        columns: {
          id: true, name: true, email: true, phone: true,
          avatar: true, createdAt: true,
        },
      },
    },
  });

  if (!property) notFound();

  // Increment view only if viewer is NOT the owner
  const isOwner = session?.user?.id === property.ownerId;
  if (!isOwner) {
    db.update(properties)
      .set({ viewCount: property.viewCount + 1 })
      .where(eq(properties.id, id))
      .catch(() => {});
  }

  // Check favorite
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

  const serialized = {
    ...property,
    images: parseImages(property.images),
    price: Number(property.price),
    latitude: Number(property.latitude),
    longitude: Number(property.longitude),
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
    owner: property.owner
      ? { ...property.owner, createdAt: property.owner.createdAt.toISOString() }
      : null,
    isFavorited,
  };

  return <PropertyDetailClient property={serialized as never} />;
}
