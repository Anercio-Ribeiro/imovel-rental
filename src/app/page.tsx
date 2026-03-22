// ============================================================
// src/app/page.tsx — Home page (Server Component)
// ============================================================
import type { Metadata } from "next";
import { HomeClient } from "@/components/layout/HomeClient";
import { db } from "@/lib/db";
import { properties, users } from "@/lib/db/schema";
import { eq, count, sum } from "drizzle-orm";
import { parseImages } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Imovelo — Imóveis em Angola",
  description: "Encontre o seu imóvel perfeito para venda e arrendamento em Angola.",
};

async function getStats() {
  try {
    const [[{ total: totalProperties }], [{ total: totalUsers }], cities] = await Promise.all([
      db.select({ total: count() }).from(properties).where(eq(properties.status, "active")),
      db.select({ total: count() }).from(users),
      db.selectDistinct({ city: properties.city }).from(properties).where(eq(properties.status, "active")),
    ]);
    return {
      totalProperties: Number(totalProperties),
      totalUsers: Number(totalUsers),
      totalCities: cities.length,
    };
  } catch {
    return { totalProperties: 0, totalUsers: 0, totalCities: 0 };
  }
}

async function getFeaturedProperties() {
  try {
    const rows = await db.query.properties.findMany({
      where: eq(properties.status, "active"),
      orderBy: (p, { desc }) => [desc(p.viewCount)],
      limit: 8,
      with: { owner: { columns: { id: true, name: true, avatar: true } } },
    });
    return rows.map((p) => ({
      ...p,
      images: parseImages(p.images),
      price: Number(p.price),
      latitude: Number(p.latitude),
      longitude: Number(p.longitude),
      // Drizzle returns null for optional integers; types expect undefined
      floor:       p.floor       ?? undefined,
      totalFloors: p.totalFloors ?? undefined,
      yearBuilt:   p.yearBuilt   ?? undefined,
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [stats, featured] = await Promise.all([getStats(), getFeaturedProperties()]);
  return <HomeClient stats={stats} initialFeatured={featured} />;
}
