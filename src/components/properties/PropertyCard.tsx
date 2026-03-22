"use client";
// ============================================================
// src/components/properties/PropertyCard.tsx
// Layout ORIGINAL preservado — apenas badge com fundo sólido
// e coração sempre visível com stroke escuro
// ============================================================
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useI18n, formatPrice } from "@/i18n";
import { useToggleFavorite } from "@/hooks/useProperties";
import { toast } from "sonner";
import { Heart, BedDouble, Bath, Maximize2, MapPin, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const { data: session } = useSession();
  const { t, locale } = useI18n();
  const toggleFavorite = useToggleFavorite();

  const title   = locale === "en" && property.titleEn ? property.titleEn : property.title;
  const images  = Array.isArray(property.images) ? property.images : [];
  const mainImg = images[0];
  const canFav  = session?.user?.role === "tenant";

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user) { toast.error(t.property.loginToFavorite); return; }
    if (!canFav) return;
    try {
      const res = await toggleFavorite.mutateAsync(property.id);
      toast.success(res.favorited ? "Adicionado aos favoritos" : "Removido dos favoritos");
    } catch { toast.error(t.common.error); }
  };

  // ── Compact / horizontal (map sidebar) ───────────────────
  if (compact) {
    return (
      <Link href={`/properties/${property.id}`} className="block group">
        <div className="flex gap-3 p-3 rounded-2xl transition-all hover:shadow-md"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          {/* Thumb */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0"
            style={{ background: "var(--bg-surface)" }}>
            {mainImg
              ? <Image src={mainImg} alt={title} fill className="object-cover" sizes="80px" />
              : <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between">
            <div>
              <span className={cn("badge text-[10px] mb-1 inline-flex",
                property.listingType === "rent" ? "badge-rent" : "badge-sale")}>
                {property.listingType === "rent" ? t.home.forRent : t.home.forSale}
              </span>
              <p className="text-sm font-semibold leading-snug line-clamp-1"
                style={{ color: "var(--text-primary)" }}>{title}</p>
              <p className="flex items-center gap-0.5 text-xs mt-0.5 line-clamp-1"
                style={{ color: "var(--text-muted)" }}>
                <MapPin className="w-3 h-3 shrink-0" />{property.city}
              </p>
            </div>
            <p className="text-sm font-bold mt-1" style={{ color: "var(--text-primary)" }}>
              {formatPrice(property.price, locale)}
              {property.priceUnit === "month" && (
                <span className="text-xs font-normal ml-0.5" style={{ color: "var(--text-muted)" }}>/mês</span>
              )}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // ── Full card (layout ORIGINAL) ───────────────────────────
  return (
    <Link href={`/properties/${property.id}`} className="block group h-full">
      <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-hover)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)"; }}>

        {/* ── IMAGE — fixed height ── */}
        <div className="relative overflow-hidden shrink-0" style={{ height: "200px", background: "var(--bg-surface)" }}>
          {mainImg ? (
            <Image
              src={mainImg}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🏠</div>
          )}

          {/* Badge com fundo sólido — sempre legível */}
          <div className="absolute top-3 left-3">
            <span className={cn("badge shadow-sm", property.listingType === "rent" ? "badge-rent" : "badge-sale")}>
              {property.listingType === "rent" ? t.home.forRent : t.home.forSale}
            </span>
          </div>

          {/* Coração — sempre visível com círculo branco + stroke escuro */}
          <button
            onClick={handleFavorite}
            aria-label={property.isFavorited ? t.property.removeFavorite : t.property.addFavorite}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.92)",
              boxShadow: "0 1px 6px rgba(0,0,0,0.20)",
              border: "none",
            }}>
            <Heart
              className="w-4 h-4 transition-all"
              style={{
                stroke: property.isFavorited ? "#FF385C" : "#222222",
                fill:   property.isFavorited ? "#FF385C" : "none",
                strokeWidth: 2,
              }}
            />
          </button>

          {/* Views */}
          {property.viewCount > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-white"
              style={{ background: "rgba(0,0,0,0.48)", backdropFilter: "blur(4px)" }}>
              <Eye className="w-3 h-3" />
              {property.viewCount}
            </div>
          )}

          {/* Image count */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 rounded-full px-2 py-0.5 text-xs text-white"
              style={{ background: "rgba(0,0,0,0.48)", backdropFilter: "blur(4px)" }}>
              1/{images.length}
            </div>
          )}
        </div>

        {/* ── BODY — flex-1 so all cards reach same bottom ── */}
        <div className="p-4 flex flex-col flex-1">
          {/* Price */}
          <p className="font-display text-xl font-semibold mb-1"
            style={{ color: "var(--gold)" }}>
            {formatPrice(property.price, locale)}
            {property.priceUnit === "month" && (
              <span className="font-sans text-xs font-normal ml-1" style={{ color: "var(--text-muted)" }}>
                {t.common.perMonth}
              </span>
            )}
          </p>

          {/* Title */}
          <h3 className="text-[15px] font-medium mb-1 line-clamp-1"
            style={{ color: "var(--text-primary)" }}>{title}</h3>

          {/* Location */}
          <p className="flex items-center gap-1 text-xs mb-4 line-clamp-1"
            style={{ color: "var(--text-muted)" }}>
            <MapPin className="w-3 h-3 shrink-0" />
            {property.city}{property.address ? `, ${property.address}` : ""}
          </p>

          {/* Features — pushed to bottom with mt-auto */}
          <div className="flex items-center pt-3 mt-auto text-xs"
            style={{
              borderTop: "1px solid var(--border-color)",
              color: "var(--text-muted)",
              gap: "clamp(8px, 3%, 16px)",
            }}>
            <span className="flex items-center gap-1 shrink-0">
              <BedDouble className="w-3.5 h-3.5 shrink-0" />
              <strong style={{ color: "var(--text-primary)" }}>{property.bedrooms}</strong>
              <span className="hidden sm:inline">qto{property.bedrooms !== 1 ? "s" : ""}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Bath className="w-3.5 h-3.5 shrink-0" />
              <strong style={{ color: "var(--text-primary)" }}>{property.bathrooms}</strong>
              <span>WC</span>
            </span>
            <span className="flex items-center gap-1 shrink-0 ml-auto">
              <Maximize2 className="w-3.5 h-3.5 shrink-0" />
              <strong style={{ color: "var(--text-primary)" }}>{property.area}</strong>
              <span>m²</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
