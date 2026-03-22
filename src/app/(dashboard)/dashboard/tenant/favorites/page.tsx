"use client";
import { useState } from "react";
import Link from "next/link";
import { useI18n, formatPrice } from "@/i18n";
import { useMyFavorites, useRemoveFavorite } from "@/hooks/useProperties";
import { toast } from "sonner";
import { Heart, Trash2, BedDouble, Bath, Maximize2, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Property } from "@/types";

const PAGE_SIZE = 8;

export default function TenantFavoritesPage() {
  const { t, locale } = useI18n();
  const { data: favorites = [], isLoading } = useMyFavorites();
  const removeFavorite = useRemoveFavorite();
  const [page, setPage] = useState(1);

  const handleRemove = async (propertyId: string) => {
    try {
      await removeFavorite.mutateAsync(propertyId);
      toast.success("Removido dos favoritos");
    } catch { toast.error(t.common.error); }
  };

  const totalPages = Math.ceil(favorites.length / PAGE_SIZE);
  const paged = favorites.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Heart className="w-6 h-6" style={{ color: "#FF385C", fill: "#FF385C" }} />
          {t.dashboard.tenant.favorites}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{favorites.length} imóveis guardados</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl animate-pulse" style={{ background: "var(--bg-surface)" }} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: "var(--bg-surface)" }}>
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: "var(--text-muted)" }} />
          <p className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{t.dashboard.tenant.noFavorites}</p>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Explore imóveis e adicione os que mais gosta</p>
          <Link href="/properties" className="btn-primary inline-flex items-center gap-2">Explorar imóveis</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {paged.map((f) => {
              const prop = f.property as (Property & { isFavorited: boolean }) | null;
              if (!prop) return null;
              const title = locale === "en" && prop.titleEn ? prop.titleEn : prop.title;
              const images = Array.isArray(prop.images) ? prop.images : [];

              return (
                <div key={f.id} className="group relative rounded-2xl overflow-hidden flex flex-col h-full"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
                  {/* Remove button */}
                  <button onClick={() => handleRemove(prop.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 1px 6px rgba(0,0,0,0.20)" }}>
                    <Trash2 className="w-3.5 h-3.5" style={{ color: "#FF385C" }} />
                  </button>

                  {/* Image */}
                  <Link href={`/properties/${prop.id}`} className="block shrink-0">
                    <div className="relative overflow-hidden" style={{ height: 200, background: "var(--bg-surface)" }}>
                      {images[0] ? (
                        <img src={images[0]} alt={title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
                      )}
                      {/* Badge — same style as PropertyCard */}
                      <div className="absolute top-3 left-3">
                        <span className={cn("badge shadow-sm", prop.listingType === "rent" ? "badge-rent" : "badge-sale")}>
                          {prop.listingType === "rent" ? t.home.forRent : t.home.forSale}
                        </span>
                      </div>
                      {/* Saved indicator */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-white"
                        style={{ background: "rgba(255,56,92,0.82)", backdropFilter: "blur(4px)" }}>
                        <Heart className="w-3 h-3 fill-white" />
                        Guardado
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <Link href={`/properties/${prop.id}`} className="block p-4 flex flex-col flex-1">
                    <p className="font-display text-xl font-bold text-gold-500 mb-1">
                      {formatPrice(prop.price, locale)}
                      {prop.priceUnit === "month" && (
                        <span className="text-xs font-sans font-normal ml-1" style={{ color: "var(--text-muted)" }}>
                          {t.common.perMonth}
                        </span>
                      )}
                    </p>
                    <h3 className="text-sm font-semibold mb-1 line-clamp-1" style={{ color: "var(--text-primary)" }}>{title}</h3>
                    <p className="text-xs flex items-center gap-1 mb-3 line-clamp-1" style={{ color: "var(--text-muted)" }}>
                      <MapPin className="w-3 h-3 shrink-0" />{prop.city}
                    </p>
                    <div className="flex items-center pt-3 mt-auto text-xs" style={{ borderTop: "1px solid var(--border-color)", color: "var(--text-muted)", gap: "clamp(8px,3%,16px)" }}>
                      <span className="flex items-center gap-1 shrink-0">
                        <BedDouble className="w-3.5 h-3.5 shrink-0" />
                        <strong style={{ color: "var(--text-primary)" }}>{prop.bedrooms}</strong>
                        <span className="hidden sm:inline">qtos</span>
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Bath className="w-3.5 h-3.5 shrink-0" />
                        <strong style={{ color: "var(--text-primary)" }}>{prop.bathrooms}</strong>
                        WC
                      </span>
                      <span className="flex items-center gap-1 shrink-0 ml-auto">
                        <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                        <strong style={{ color: "var(--text-primary)" }}>{prop.area}</strong>m²
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all disabled:opacity-40"
                style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-9 h-9 rounded-xl text-sm font-semibold border transition-all"
                  style={{
                    background: page === p ? "var(--brand)" : "transparent",
                    color: page === p ? "#fff" : "var(--text-muted)",
                    borderColor: page === p ? "var(--brand)" : "var(--border-color)",
                  }}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all disabled:opacity-40"
                style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
