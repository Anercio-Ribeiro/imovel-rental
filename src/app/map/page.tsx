"use client";
// ============================================================
// src/app/map/page.tsx — Full-screen map page
// ============================================================
import { useState } from "react";
import { useI18n, formatPrice } from "@/i18n";
import { useProperties } from "@/hooks/useProperties";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyCard } from "@/components/properties/PropertyCard";
import dynamic from "next/dynamic";
import { Search, SlidersHorizontal } from "lucide-react";
import type { PropertyFilters } from "@/types";

const PropertyMap = dynamic(
  () => import("@/components/map/PropertyMap").then((m) => m.PropertyMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-dark-3 animate-pulse" /> }
);

export default function MapPage() {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [filters, setFilters] = useState<PropertyFilters>({ pageSize: 50 });
  const [search, setSearch] = useState("");

  const { data } = useProperties(filters);
  const properties = data?.data ?? [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((p) => ({ ...p, search: search || undefined }));
  };

  return (
    <div className="h-screen flex flex-col bg-dark">
      <Navbar />

      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Side panel */}
        <div className="w-80 shrink-0 flex flex-col bg-dark-2 border-r border-gold-500/10 overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-gold-500/10">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.home.searchPlaceholder}
                className="input-base pl-10 pr-10"
              />
            </form>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setFilters((p) => ({ ...p, listingType: p.listingType === "rent" ? undefined : "rent" }))}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${filters.listingType === "rent" ? "border-blue-500/40 bg-blue-500/10 text-blue-400" : "border-gold-500/15 text-muted-foreground hover:border-gold-500/25"}`}>
                {t.home.forRent}
              </button>
              <button
                onClick={() => setFilters((p) => ({ ...p, listingType: p.listingType === "sale" ? undefined : "sale" }))}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${filters.listingType === "sale" ? "border-green-500/40 bg-green-500/10 text-green-400" : "border-gold-500/15 text-muted-foreground hover:border-gold-500/25"}`}>
                {t.home.forSale}
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="px-4 py-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{properties.length} {t.common.results}</p>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {properties.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`rounded-xl transition-all cursor-pointer ${selectedId === p.id ? "ring-1 ring-gold-500" : ""}`}>
                <PropertyCard property={p} compact />
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <PropertyMap
            properties={properties}
            selectedId={selectedId}
            onSelect={setSelectedId}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
