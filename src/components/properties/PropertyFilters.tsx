"use client";
// ============================================================
// src/components/properties/PropertyFilters.tsx
// ============================================================
import { useState } from "react";
import { useI18n } from "@/i18n";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PropertyFilters, PropertyType, ListingType } from "@/types";

const CITIES = [
  "Luanda", "Benguela", "Huambo", "Lubango", "Malanje",
  "Namibe", "Cabinda", "Saurimo", "Soyo", "Uíge",
];

const BEDROOMS = [1, 2, 3, 4, 5];

interface Props {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
}

export function PropertyFiltersBar({ filters, onChange }: Props) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [local, setLocal] = useState<PropertyFilters>(filters);

  const update = (key: keyof PropertyFilters, value: unknown) => {
    setLocal((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const apply = () => {
    onChange({ ...local, page: 1 });
    setExpanded(false);
  };

  const clear = () => {
    const cleared: PropertyFilters = { page: 1, pageSize: 8 };
    setLocal(cleared);
    onChange(cleared);
  };

  const hasFilters = Object.entries(local).some(
    ([k, v]) => !["page", "pageSize"].includes(k) && v !== undefined && v !== ""
  );

  return (
    <div className="mb-6">
      {/* Search bar + filter toggle */}
      <div className="flex gap-3 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={local.search ?? ""}
            onChange={(e) => update("search", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            placeholder={t.home.searchPlaceholder}
            className="input-base pl-10"
          />
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all",
            expanded || hasFilters
              ? "border-gold-500/50 text-gold-500 bg-gold-500/8"
              : "border-gold-500/15 text-muted-foreground hover:border-gold-500/30 hover:text-foreground"
          )}>
          <SlidersHorizontal className="w-4 h-4" />
          {t.filters.title}
          {hasFilters && (
            <span className="w-5 h-5 bg-gold-500 text-dark-DEFAULT text-xs rounded-full flex items-center justify-center font-bold">
              {Object.entries(local).filter(([k, v]) => !["page", "pageSize"].includes(k) && v !== undefined && v !== "").length}
            </span>
          )}
        </button>
        <button onClick={apply} className="btn-primary px-6">
          {t.common.search}
        </button>
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="bg-dark-card border border-gold-500/15 rounded-xl p-5 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{t.filters.location}</label>
              <select value={local.city ?? ""} onChange={(e) => update("city", e.target.value)} className="input-base">
                <option value="">{t.filters.anyLocation}</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{t.filters.type}</label>
              <select value={local.type ?? ""} onChange={(e) => update("type", e.target.value)} className="input-base">
                <option value="">{t.filters.anyType}</option>
                {Object.entries(t.property.type).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            {/* Listing type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{t.filters.listingType}</label>
              <select value={local.listingType ?? ""} onChange={(e) => update("listingType", e.target.value)} className="input-base">
                <option value="">{t.filters.anyListing}</option>
                <option value="rent">{t.home.forRent}</option>
                <option value="sale">{t.home.forSale}</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{t.filters.bedrooms}</label>
              <select value={local.bedrooms ?? ""} onChange={(e) => update("bedrooms", e.target.value ? Number(e.target.value) : undefined)} className="input-base">
                <option value="">{t.filters.anyBedrooms}</option>
                {BEDROOMS.map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{t.filters.sortBy}</label>
              <select value={local.sortBy ?? "newest"} onChange={(e) => update("sortBy", e.target.value)} className="input-base">
                <option value="newest">{t.filters.sort.newest}</option>
                <option value="price_asc">{t.filters.sort.priceAsc}</option>
                <option value="price_desc">{t.filters.sort.priceDesc}</option>
                <option value="most_viewed">{t.filters.sort.mostViewed}</option>
              </select>
            </div>
          </div>

          {/* Price range */}
          <div className="flex flex-wrap items-end gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{t.filters.minPrice}</label>
              <input
                type="number"
                min={0}
                value={local.minPrice ?? ""}
                onChange={(e) => update("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="input-base w-36"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{t.filters.maxPrice}</label>
              <input
                type="number"
                min={0}
                value={local.maxPrice ?? ""}
                onChange={(e) => update("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="∞"
                className="input-base w-36"
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-5">
            {(["furnished", "petFriendly"] as const).map((key) => (
              <button
                key={key}
                onClick={() => update(key, local[key] ? undefined : true)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs border transition-all",
                  local[key]
                    ? "border-gold-500/50 bg-gold-500/10 text-gold-400"
                    : "border-gold-500/15 text-muted-foreground hover:border-gold-500/30"
                )}>
                {t.property.amenities[key === "furnished" ? "furnished" : "petFriendly"]}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end border-t border-gold-500/10 pt-4">
            {hasFilters && (
              <button onClick={clear} className="flex items-center gap-1.5 btn-ghost text-sm">
                <X className="w-3.5 h-3.5" /> {t.filters.clearAll}
              </button>
            )}
            <button onClick={apply} className="btn-primary">{t.filters.apply}</button>
          </div>
        </div>
      )}
    </div>
  );
}
