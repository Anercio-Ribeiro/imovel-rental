"use client";
// ============================================================
// src/app/(dashboard)/dashboard/tenant/bookings/page.tsx
// ============================================================
import Link from "next/link";
import { useI18n, formatPrice } from "@/i18n";
import { useMyBookings, useUpdateBookingStatus } from "@/hooks/useProperties";
import { toast } from "sonner";
import { CalendarCheck, MapPin, Clock, CheckCircle2, XCircle, Ban } from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";

export default function TenantBookingsPage() {
  const { t, locale } = useI18n();
  const { data: bookings = [], isLoading } = useMyBookings();
  const updateStatus = useUpdateBookingStatus();

  const handleCancel = async (id: string) => {
    if (!confirm("Tem a certeza que quer cancelar esta reserva?")) return;
    try {
      await updateStatus.mutateAsync({ id, status: "cancelled" });
      toast.success("Reserva cancelada");
    } catch {
      toast.error(t.common.error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t.dashboard.tenant.bookings}</h1>
        <p className="text-muted-foreground text-sm mt-1">{bookings.length} pedidos de reserva</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-dark-card border border-gold-500/10 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-dark-card border border-gold-500/10 rounded-2xl">
          <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-lg font-medium mb-2">{t.dashboard.tenant.noBookings}</p>
          <p className="text-muted-foreground text-sm mb-6">Explore imóveis e faça a sua primeira reserva</p>
          <Link href="/properties" className="btn-primary inline-flex items-center gap-2">
            Ver imóveis disponíveis
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => {
            const prop = b.property as { id?: string; title?: string; titleEn?: string; images?: string[]; city?: string; address?: string } | null;
            const img = prop?.images?.[0];
            const title = locale === "en" && (prop as { titleEn?: string })?.titleEn
              ? (prop as { titleEn?: string }).titleEn
              : prop?.title;

            return (
              <div key={b.id} className="bg-dark-card border border-gold-500/15 rounded-xl overflow-hidden">
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-dark-3 shrink-0">
                    {img
                      ? <img src={img} alt={title ?? ""} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Link href={prop?.id ? `/properties/${prop.id}` : "#"}
                        className="font-medium hover:text-gold-400 transition-colors line-clamp-1">
                        {title ?? "—"}
                      </Link>
                      <span className={cn("badge shrink-0",
                        b.status === "approved" ? "badge-approved" :
                        b.status === "rejected" ? "badge-rejected" :
                        b.status === "cancelled" ? "badge-cancelled" : "badge-pending")}>
                        {b.status === "approved" && <CheckCircle2 className="w-3 h-3" />}
                        {b.status === "rejected" && <XCircle className="w-3 h-3" />}
                        {b.status === "pending" && <Clock className="w-3 h-3" />}
                        {b.status === "cancelled" && <Ban className="w-3 h-3" />}
                        {t.booking.status[b.status as keyof typeof t.booking.status]}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {prop?.city ?? "—"}{prop?.address ? `, ${prop.address}` : ""}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Entrada</p>
                        <p className="font-medium">{formatDateShort(b.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Saída</p>
                        <p className="font-medium">{formatDateShort(b.endDate)}</p>
                      </div>
                      {b.nights != null && (
                        <div>
                          <p className="text-xs text-muted-foreground">Noites</p>
                          <p className="font-medium">{b.nights}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-display font-semibold text-gold-500">
                          {formatPrice(Number(b.totalPrice), locale)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message + action */}
                {(b.message || b.status === "pending") && (
                  <div className="border-t border-gold-500/10 px-4 py-3 flex items-center justify-between gap-3">
                    {b.message && (
                      <p className="text-xs text-muted-foreground italic flex-1 truncate">
                        "{b.message}"
                      </p>
                    )}
                    {b.status === "pending" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={updateStatus.isPending}
                        className="shrink-0 text-xs text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all">
                        {t.booking.cancel}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
