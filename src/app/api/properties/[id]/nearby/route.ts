// ============================================================
// src/app/api/properties/[id]/nearby/route.ts
// Uses Overpass API (OpenStreetMap) — completely free, no key needed
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { properties } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { NearbyPlace, NearbyPlaceType } from "@/types";


// Maps OSM amenity/leisure tags to our types
const OSM_TYPE_MAP: Record<string, NearbyPlaceType> = {
  school: "school",
  university: "school",
  college: "school",
  hospital: "hospital",
  clinic: "hospital",
  doctors: "hospital",
  supermarket: "supermarket",
  convenience: "supermarket",
  restaurant: "restaurant",
  cafe: "restaurant",
  park: "park",
  beach: "beach",
  pharmacy: "pharmacy",
  bank: "bank",
  atm: "bank",
  bus_station: "transport",
  subway_entrance: "transport",
  fitness_centre: "gym",
  sports_centre: "gym",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const property = await db.query.properties.findFirst({
      where: eq(properties.id, id),
      columns: { latitude: true, longitude: true },
    });

    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    const lat = Number(property.latitude);
    const lng = Number(property.longitude);
    const radius = 5000; // 5km

    // Overpass QL query — fetch amenities within 5km
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"school|university|hospital|clinic|supermarket|restaurant|cafe|pharmacy|bank|bus_station"](around:${radius},${lat},${lng});
        node["leisure"~"park|beach|fitness_centre|sports_centre"](around:${radius},${lat},${lng});
        node["natural"="beach"](around:${radius},${lat},${lng});
      );
      out body 60;
    `;

    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const response = await fetch(overpassUrl, {
      method: "POST",
      body: query,
      headers: { "Content-Type": "text/plain" },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      // Fallback: return mocked data if Overpass is unavailable
      return NextResponse.json(getMockedNearbyPlaces(lat, lng));
    }

    const osmData = await response.json() as {
      elements: Array<{
        id: number;
        lat: number;
        lon: number;
        tags?: Record<string, string>;
      }>;
    };

    const places: NearbyPlace[] = osmData.elements
      .map((el) => {
        const tags = el.tags ?? {};
        const osmType = tags.amenity ?? tags.leisure ?? tags.natural ?? "";
        const placeType = OSM_TYPE_MAP[osmType];
        if (!placeType) return null;

        const dLat = el.lat - lat;
        const dLng = el.lon - lng;
        const distance = Math.round(
          Math.sqrt(dLat ** 2 + dLng ** 2) * 111320
        );

        const name =
          tags.name ??
          tags["name:pt"] ??
          tags["name:en"] ??
          `${osmType.charAt(0).toUpperCase()}${osmType.slice(1)}`;

        return {
          id: String(el.id),
          name,
          type: placeType,
          distance,
          latitude: el.lat,
          longitude: el.lon,
        } satisfies NearbyPlace;
      })
      .filter((p): p is NearbyPlace => p !== null && p.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20); // max 20 results

    return NextResponse.json(places);
  } catch (error) {
    console.error("[GET /api/properties/[id]/nearby]", error);
    // Return mocked data on any error
    return NextResponse.json(getMockedNearbyPlaces(0, 0));
  }
}

/** Fallback mocked places for demo/offline */
function getMockedNearbyPlaces(lat: number, lng: number): NearbyPlace[] {
  return [
    { id: "1", name: "Escola Primária Central", type: "school", distance: 320, latitude: lat + 0.003, longitude: lng + 0.002 },
    { id: "2", name: "Hospital Geral", type: "hospital", distance: 850, latitude: lat - 0.007, longitude: lng + 0.004 },
    { id: "3", name: "Supermercado Jumbo", type: "supermarket", distance: 450, latitude: lat + 0.004, longitude: lng - 0.003 },
    { id: "4", name: "Praia da Ilha", type: "beach", distance: 1200, latitude: lat - 0.01, longitude: lng + 0.009 },
    { id: "5", name: "Parque da Cidade", type: "park", distance: 680, latitude: lat + 0.006, longitude: lng - 0.005 },
    { id: "6", name: "Farmácia São Lucas", type: "pharmacy", distance: 230, latitude: lat + 0.002, longitude: lng + 0.001 },
    { id: "7", name: "Banco BFA", type: "bank", distance: 560, latitude: lat - 0.005, longitude: lng + 0.003 },
    { id: "8", name: "Paragem Morro Bento", type: "transport", distance: 190, latitude: lat + 0.001, longitude: lng - 0.002 },
    { id: "9", name: "Restaurante O Pescador", type: "restaurant", distance: 390, latitude: lat - 0.003, longitude: lng + 0.004 },
    { id: "10", name: "Fitness Club", type: "gym", distance: 920, latitude: lat + 0.008, longitude: lng - 0.007 },
  ];
}
