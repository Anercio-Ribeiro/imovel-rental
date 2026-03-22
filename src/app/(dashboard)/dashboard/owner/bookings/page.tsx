"use client";
// src/app/(dashboard)/dashboard/owner/bookings/page.tsx
import { useI18n, formatPrice } from "@/i18n";
import { useOwnerBookings, useUpdateBookingStatus } from "@/hooks/useProperties";
import { toast } from "sonner";
import { CalendarCheck, CheckCircle, XCircle, Clock, MapPin, User } from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";
import Link from "next/link";

export default function OwnerBookingsPage() {
  const { t, locale } = useI18n();
  const { data: bookings = [], isLoading } = useOwnerBookings();
  const updateStatus = useUpdateBookingStatus();

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(status === "approved" ? "✅ Reserva aprovada!" : "❌ Reserva rejeitada");
    } catch {
      toast.error(t.common.error);
    }
  };

  const pending   = bookings.filter((b) => b.status === "pending");
  const approved  = bookings.filter((b) => b.status === "approved");
  const others    = bookings.filter((b) => !["pending","approved"].includes(b.status));

  const BookingRow = ({ b }: { b: (typeof bookings)[0] }) => {
    const prop   = b.property as { id?: string; title?: string; images?: string[] } | null;
    const tenant = b.tenant   as { name?: string; email?: string; phone?: string } | null;
    const img    = (prop?.images ?? [])[0];

    return (
      <div className="flex items-start gap-4 p-4 bg-dark-card border border-gold-500/15 rounded-xl">
        {/* Property thumb */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark-3 shrink-0">
          {img ? <img src={img} alt="" className="w-full h-full object-cover" />
               : <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
            <div>
              <Link href={prop?.id ? `/properties/${prop.id}` : "#"}
                className="text-sm font-medium hover:text-gold-400 transition-colors line-clamp-1">
                {prop?.title ?? "—"}
              </Link>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <User className="w-3 h-3" />
                {tenant?.name ?? "—"}
                {tenant?.email && <span className="opacity-60">· {tenant.email}</span>}
              </div>
            </div>
            <span className={cn("badge shrink-0",
              b.status === "approved"  ? "badge-approved"  :
              b.status === "rejected"  ? "badge-rejected"  :
              b.status === "cancelled" ? "badge-cancelled" : "badge-pending")}>
              {t.booking.status[b.status as keyof typeof t.booking.status]}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
            <span>📅 {formatDateShort(b.startDate)} → {formatDateShort(b.endDate)}</span>
            {b.nights != null && <span>🌙 {b.nights} noites</span>}
            <span className="text-gold-400 font-display font-semibold text-sm">
              {formatPrice(Number(b.totalPrice), locale)}
            </span>
          </div>

          {b.message && (
            <p className="text-xs text-muted-foreground italic bg-dark-2 rounded-lg px-3 py-2 mb-3 border border-gold-500/8">
              "{b.message}"
            </p>
          )}

          {/* Actions for pending */}
          {b.status === "pending" && (
            <div className="flex gap-2">
              <button onClick={() => handleAction(b.id, "approved")}
                disabled={updateStatus.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 transition-all font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> {t.booking.approve}
              </button>
              <button onClick={() => handleAction(b.id, "rejected")}
                disabled={updateStatus.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all font-medium">
                <XCircle className="w-3.5 h-3.5" /> {t.booking.reject}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t.dashboard.owner.pendingBookings}</h1>
        <p className="text-muted-foreground text-sm mt-1">{bookings.length} pedidos no total</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({length: 3}).map((_,i) => (
            <div key={i} className="h-28 bg-dark-card border border-gold-500/10 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-dark-card border border-gold-500/10 rounded-2xl">
          <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-lg font-medium">Sem reservas ainda</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Pending */}
          {pending.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-400 mb-3">
                <Clock className="w-4 h-4" /> Pendentes ({pending.length})
              </h2>
              <div className="flex flex-col gap-3">
                {pending.map((b) => <BookingRow key={b.id} b={b} />)}
              </div>
            </section>
          )}

          {/* Approved */}
          {approved.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-green-400 mb-3">
                <CheckCircle className="w-4 h-4" /> Aprovadas ({approved.length})
              </h2>
              <div className="flex flex-col gap-3">
                {approved.map((b) => <BookingRow key={b.id} b={b} />)}
              </div>
            </section>
          )}

          {/* Others */}
          {others.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Outras ({others.length})
              </h2>
              <div className="flex flex-col gap-3">
                {others.map((b) => <BookingRow key={b.id} b={b} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
