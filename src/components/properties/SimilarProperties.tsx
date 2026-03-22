"use client";
// src/components/properties/SimilarProperties.tsx
import { useProperties } from "@/hooks/useProperties";
import { PropertyCard } from "./PropertyCard";
import { useI18n } from "@/i18n";
import type { PropertyType, ListingType } from "@/types";

interface Props {
  currentId: string;
  type: PropertyType;
  listingType: ListingType;
  city: string;
}

export function SimilarProperties({ currentId, type, listingType, city }: Props) {
  const { t, locale } = useI18n();
  const { data } = useProperties({ type, listingType, city, pageSize: 4 });

  const similar = (data?.data ?? []).filter((p) => p.id !== currentId).slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gold-500/10">
      <h2 className="font-display text-xl font-semibold mb-6">
        {locale === "en" ? "Similar Properties" : "Imóveis Semelhantes"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {similar.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}
