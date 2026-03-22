"use client";
// ============================================================
// src/app/(public)/properties/page.tsx — Property listing page
// ============================================================
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFiltersBar } from "@/components/properties/PropertyFilters";
import { Pagination } from "@/components/shared/Pagination";
import { PropertyGridSkeleton } from "@/components/shared/Skeleton";
import { useProperties } from "@/hooks/useProperties";
import { useI18n } from "@/i18n";
import { LayoutGrid, Map, List } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import type { PropertyFilters } from "@/types";

// Dynamically import map to avoid SSR
const PropertyMap = dynamic(
  () => import("@/components/map/PropertyMap").then((m) => m.PropertyMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-dark-3 rounded-xl animate-pulse" /> }
);

type ViewMode = "grid" | "list" | "map";

export default function PropertiesPage() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();

  const [filters, setFilters] = useState<PropertyFilters>({
    search: searchParams.get("search") ?? undefined,
    listingType: (searchParams.get("listingType") as never) ?? undefined,
    city: searchParams.get("city") ?? undefined,
    page: 1,
    pageSize: 8,
  });

  const { data, isLoading, isError } = useProperties(filters);

  const properties = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="pt-16">
        <div className="page-container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-semibold">{t.nav.properties}</h1>
              {data && (
                <p className="text-sm text-muted-foreground mt-1">
                  {data.total} {t.common.results}
                </p>
              )}
            </div>
            {/* View mode toggle */}
            <div className="flex items-center gap-1 bg-dark-2 border border-gold-500/15 rounded-lg p-1">
              {([
                { mode: "grid" as ViewMode, Icon: LayoutGrid },
                { mode: "list" as ViewMode, Icon: List },
                { mode: "map" as ViewMode, Icon: Map },
              ] as const).map(({ mode, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === mode
                      ? "bg-dark-surface text-gold-500"
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <PropertyFiltersBar filters={filters} onChange={setFilters} />

          {/* Error */}
          {isError && (
            <div className="text-center py-20 text-red-400">
              <p>{t.common.error}</p>
            </div>
          )}

          {/* Map view */}
          {viewMode === "map" && (
            <div className="flex gap-4 h-[75vh]">
              {/* Side list */}
              <div className="w-80 shrink-0 overflow-y-auto flex flex-col gap-3 pr-2">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-dark-card border border-gold-500/10 rounded-xl h-24 animate-pulse" />
                  ))
                ) : properties.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPropertyId(p.id)}
                    className={cn(
                      "cursor-pointer transition-all",
                      selectedPropertyId === p.id ? "ring-1 ring-gold-500 rounded-xl" : ""
                    )}>
                    <PropertyCard property={p} compact />
                  </div>
                ))}
              </div>
              {/* Map */}
              <div className="flex-1 rounded-xl overflow-hidden border border-gold-500/15">
                <PropertyMap
                  properties={properties}
                  selectedId={selectedPropertyId}
                  onSelect={setSelectedPropertyId}
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Grid or list view */}
          {viewMode !== "map" && (
            <>
              {isLoading ? (
                <PropertyGridSkeleton count={8} />
              ) : properties.length === 0 ? (
                <div className="text-center py-24">
                  <p className="text-4xl mb-4">🏠</p>
                  <p className="text-lg font-medium mb-2">{t.common.noResults}</p>
                  <p className="text-muted-foreground text-sm">{t.filters.clearAll}</p>
                </div>
              ) : (
                <div className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
                    : "flex flex-col gap-4"
                )}>
                  {properties.map((p) => (
                    <PropertyCard key={p.id} property={p} compact={viewMode === "list"} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {data && (
                <Pagination
                  page={filters.page ?? 1}
                  totalPages={totalPages}
                  total={data.total}
                  pageSize={filters.pageSize ?? 8}
                  onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
