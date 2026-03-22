"use client";
// ============================================================
// src/components/dashboard/OwnerDashboardOverview.tsx
// ============================================================
import Link from "next/link";
import { useI18n, formatPrice } from "@/i18n";
import { useOwnerStats, useOwnerBookings, useUpdateBookingStatus } from "@/hooks/useProperties";
import { StatCardSkeleton } from "@/components/shared/Skeleton";
import { toast } from "sonner";
import {
  Building2, Eye, CalendarCheck, TrendingUp, PlusSquare,
  BarChart3, CheckCircle, XCircle, Clock,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

interface Props { userName: string }

export function OwnerDashboardOverview({ userName }: Props) {
  const { t, locale } = useI18n();
  const { data: stats, isLoading } = useOwnerStats();
  const { data: bookings = [] } = useOwnerBookings();
  const updateStatus = useUpdateBookingStatus();

  const pendingBookings = bookings.filter((b) => b.status === "pending").slice(0, 5);

  const handleBookingAction = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(status === "approved" ? "Reserva aprovada!" : "Reserva rejeitada");
    } catch {
      toast.error(t.common.error);
    }
  };

  const statCards = [
    { label: t.dashboard.owner.totalProperties, value: stats?.totalProperties ?? 0, icon: Building2, trend: "+2" },
    { label: t.dashboard.owner.totalViews, value: stats?.totalViews ?? 0, icon: Eye, trend: "+12%" },
    { label: t.dashboard.owner.totalBookings, value: stats?.totalBookings ?? 0, icon: CalendarCheck, trend: "+5" },
    { label: t.dashboard.owner.monthlyRevenue, value: stats ? formatPrice(stats.monthlyRevenue, locale) : "—", icon: TrendingUp, trend: "+8%" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {t.dashboard.welcome}, <span className="text-gold-500">{userName.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t.dashboard.owner.title}</p>
        </div>
        <Link href="/dashboard/owner/add" className="btn-primary flex items-center gap-2">
          <PlusSquare className="w-4 h-4" />
          {t.dashboard.owner.addProperty}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map(({ label, value, icon: Icon, trend }) => (
            <div key={label} className="bg-dark-card border border-gold-500/15 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <div className="w-8 h-8 bg-gold-500/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gold-500" />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-gold-500">{value}</p>
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {trend} este mês
              </p>
            </div>
          ))}
      </div>

      {/* Charts row */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views chart */}
          <div className="bg-dark-card border border-gold-500/15 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-gold-500" />
              {t.dashboard.owner.viewsByMonth}
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stats.viewsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.08)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9A968E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9A968E" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1E1E26", border: "0.5px solid rgba(201,168,76,0.3)", borderRadius: 8 }}
                  labelStyle={{ color: "#F0EDE8" }}
                  itemStyle={{ color: "#C9A84C" }}
                />
                <Bar dataKey="views" fill="#C9A84C" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bookings chart */}
          <div className="bg-dark-card border border-gold-500/15 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-gold-500" />
              {t.dashboard.owner.bookingsByMonth}
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stats.bookingsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.08)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9A968E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9A968E" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1E1E26", border: "0.5px solid rgba(201,168,76,0.3)", borderRadius: 8 }}
                  labelStyle={{ color: "#F0EDE8" }}
                  itemStyle={{ color: "#4CAF7D" }}
                />
                <Bar dataKey="bookings" fill="#4CAF7D" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pending bookings */}
      {pendingBookings.length > 0 && (
        <div className="bg-dark-card border border-gold-500/15 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gold-500/10">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-500" />
              {t.dashboard.owner.pendingBookings} ({pendingBookings.length})
            </h2>
            <Link href="/dashboard/owner/properties" className="text-xs text-gold-400 hover:text-gold-300">Ver todas →</Link>
          </div>
          <div className="divide-y divide-gold-500/10">
            {pendingBookings.map((b) => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {(b.property as { title?: string } | null)?.title ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(b.tenant as { name?: string } | null)?.name ?? "—"} •{" "}
                    {formatDate(b.startDate, locale === "pt" ? "pt-PT" : "en-US")}
                    {" → "}
                    {formatDate(b.endDate, locale === "pt" ? "pt-PT" : "en-US")}
                  </p>
                </div>
                <p className="text-sm font-display text-gold-500 shrink-0">
                  {formatPrice(Number(b.totalPrice), locale)}
                </p>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleBookingAction(b.id, "approved")}
                    disabled={updateStatus.isPending}
                    className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 flex items-center justify-center transition-all">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleBookingAction(b.id, "rejected")}
                    disabled={updateStatus.isPending}
                    className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
