"use client";
// ============================================================
// src/components/dashboard/TenantDashboardOverview.tsx
// ============================================================
import Link from "next/link";
import Image from "next/image";
import { useI18n, formatPrice } from "@/i18n";
import { useMyBookings, useMyFavorites } from "@/hooks/useProperties";
import { StatCardSkeleton } from "@/components/shared/Skeleton";
import { CalendarCheck, Heart, Clock, CheckCircle2, XCircle, MapPin } from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";

interface Props { userName: string }

export function TenantDashboardOverview({ userName }: Props) {
  const { t, locale } = useI18n();
  const { data: bookings = [], isLoading: bookingsLoading } = useMyBookings();
  const { data: favorites = [], isLoading: favLoading } = useMyFavorites();

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const approvedBookings = bookings.filter((b) => b.status === "approved").length;
  const totalFavorites = favorites.length;

  const recentBookings = bookings.slice(0, 5);
  const recentFavorites = favorites.slice(0, 4);

  const statusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    if (status === "rejected") return <XCircle className="w-4 h-4 text-red-400" />;
    return <Clock className="w-4 h-4 text-gold-400" />;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold">
          {t.dashboard.welcome}, <span className="text-gold-500">{userName.split(" ")[0]}</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{t.dashboard.tenant.title}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {bookingsLoading || favLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : [
              { label: "Total de reservas", value: totalBookings, icon: CalendarCheck, color: "text-blue-400" },
              { label: "Reservas pendentes", value: pendingBookings, icon: Clock, color: "text-gold-400" },
              { label: "Reservas aprovadas", value: approvedBookings, icon: CheckCircle2, color: "text-green-400" },
              { label: "Favoritos", value: totalFavorites, icon: Heart, color: "text-red-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-dark-card border border-gold-500/15 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                  <Icon className={cn("w-5 h-5", color)} />
                </div>
                <p className="font-display text-3xl font-bold">{value}</p>
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <div className="bg-dark-card border border-gold-500/15 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gold-500/10">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-gold-500" />
              {t.dashboard.tenant.bookings}
            </h2>
            <Link href="/dashboard/tenant/bookings" className="text-xs text-gold-400 hover:text-gold-300">Ver todas →</Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm">
              <CalendarCheck className="w-8 h-8 mx-auto mb-2 opacity-30" />
              {t.dashboard.tenant.noBookings}
            </div>
          ) : (
            <div className="divide-y divide-gold-500/8">
              {recentBookings.map((b) => {
                const prop = b.property as { title?: string; images?: string[]; city?: string } | null;
                const img = prop?.images?.[0];
                return (
                  <div key={b.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-3 shrink-0">
                      {img
                        ? <img src={img} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-lg">🏠</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{prop?.title ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateShort(b.startDate)} → {formatDateShort(b.endDate)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {statusIcon(b.status)}
                      <span className={cn("text-xs badge",
                        b.status === "approved" ? "badge-approved" :
                        b.status === "rejected" ? "badge-rejected" :
                        b.status === "cancelled" ? "badge-cancelled" : "badge-pending")}>
                        {t.booking.status[b.status as keyof typeof t.booking.status]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Favorites */}
        <div className="bg-dark-card border border-gold-500/15 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gold-500/10">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              {t.dashboard.tenant.favorites}
            </h2>
            <Link href="/dashboard/tenant/favorites" className="text-xs text-gold-400 hover:text-gold-300">Ver todos →</Link>
          </div>

          {recentFavorites.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm">
              <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" />
              {t.dashboard.tenant.noFavorites}
            </div>
          ) : (
            <div className="divide-y divide-gold-500/8">
              {recentFavorites.map((f) => {
                const prop = f.property as { id?: string; title?: string; images?: string[]; city?: string; price?: number } | null;
                const img = prop?.images?.[0];
                return (
                  <Link key={f.id} href={prop?.id ? `/properties/${prop.id}` : "#"}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-dark-2/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-3 shrink-0">
                      {img
                        ? <img src={img} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-lg">🏠</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{prop?.title ?? "—"}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {prop?.city ?? "—"}
                      </p>
                    </div>
                    {prop?.price != null && (
                      <p className="text-sm font-display font-semibold text-gold-500 shrink-0">
                        {formatPrice(prop.price, locale)}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
