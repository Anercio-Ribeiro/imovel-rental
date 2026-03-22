"use client";
// ============================================================
// src/app/(dashboard)/dashboard/admin/bookings/page.tsx
// ============================================================
import { useState } from "react";
import { useI18n, formatPrice } from "@/i18n";
import { useAdminBookings, useUpdateBookingStatus } from "@/hooks/useProperties";
import { Pagination } from "@/components/shared/Pagination";
import { toast } from "sonner";
import { CalendarCheck, CheckCircle, XCircle } from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";

export default function AdminBookingsPage() {
  const { t, locale } = useI18n();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminBookings(page);
  const updateStatus = useUpdateBookingStatus();
  const bookings = data?.data ?? [];

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(status === "approved" ? "Aprovado" : "Rejeitado");
    } catch {
      toast.error(t.common.error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-gold-500" />
          {t.dashboard.admin.bookings}
        </h1>
        {data && <p className="text-muted-foreground text-sm mt-1">{data.total} reservas</p>}
      </div>

      <div className="bg-dark-card border border-gold-500/15 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold-500/10 bg-dark-2">
              <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium">Imóvel / Inquilino</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium hidden md:table-cell">Datas</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium">Total</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium">Estado</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-muted-foreground font-medium">Acções</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-500/8">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-dark-surface rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : bookings.map((b) => {
                  const prop = b.property as { title?: string } | null;
                  const tenant = b.tenant as { name?: string; email?: string } | null;
                  return (
                    <tr key={b.id} className="hover:bg-dark-2/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium line-clamp-1">{prop?.title ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{tenant?.name ?? "—"}</p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-xs text-muted-foreground">
                          {formatDateShort(b.startDate)} → {formatDateShort(b.endDate)}
                        </p>
                        {b.nights != null && <p className="text-xs text-muted-foreground">{b.nights} noites</p>}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-display font-semibold text-gold-500">
                          {formatPrice(Number(b.totalPrice), locale)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("badge",
                          b.status === "approved" ? "badge-approved" :
                          b.status === "rejected" ? "badge-rejected" :
                          b.status === "cancelled" ? "badge-cancelled" : "badge-pending")}>
                          {t.booking.status[b.status as keyof typeof t.booking.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {b.status === "pending" && (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleStatus(b.id, "approved")}
                              className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 flex items-center justify-center transition-all">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleStatus(b.id, "rejected")}
                              className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {data && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}
    </div>
  );
}
