"use client";
// ============================================================
// src/app/(dashboard)/dashboard/owner/stats/page.tsx
// ============================================================
import { useI18n, formatPrice } from "@/i18n";
import { useOwnerStats } from "@/hooks/useProperties";
import { StatCardSkeleton } from "@/components/shared/Skeleton";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { Eye, CalendarCheck, TrendingUp, Building2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TOOLTIP_STYLE = {
  contentStyle: { background: "#1E1E26", border: "0.5px solid rgba(201,168,76,0.3)", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "#F0EDE8" },
};

export default function OwnerStatsPage() {
  const { t, locale } = useI18n();
  const { data: stats, isLoading } = useOwnerStats();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t.dashboard.owner.stats}</h1>
        <p className="text-muted-foreground text-sm mt-1">Análise de desempenho dos seus imóveis</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : [
              { label: t.dashboard.owner.totalProperties, value: stats?.totalProperties ?? 0, icon: Building2 },
              { label: t.dashboard.owner.totalViews, value: stats?.totalViews ?? 0, icon: Eye },
              { label: t.dashboard.owner.totalBookings, value: stats?.totalBookings ?? 0, icon: CalendarCheck },
              { label: t.dashboard.owner.monthlyRevenue, value: stats ? formatPrice(stats.monthlyRevenue, locale) : "—", icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-dark-card border border-gold-500/15 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-gold-500" />
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                </div>
                <p className="font-display text-2xl font-bold text-gold-500">{value}</p>
              </div>
            ))}
      </div>

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-card border border-gold-500/15 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-gold-500" />
              {t.dashboard.owner.viewsByMonth}
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.viewsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.08)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9A968E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9A968E" }} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} itemStyle={{ color: "#C9A84C" }} />
                <Bar dataKey="views" fill="#C9A84C" radius={[4, 4, 0, 0]} maxBarSize={40} name="Visualizações" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-dark-card border border-gold-500/15 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-gold-500" />
              {t.dashboard.owner.bookingsByMonth}
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.bookingsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.08)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9A968E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9A968E" }} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} itemStyle={{ color: "#4CAF7D" }} />
                <Line type="monotone" dataKey="bookings" stroke="#4CAF7D" strokeWidth={2} dot={{ fill: "#4CAF7D", r: 4 }} name="Reservas" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top properties */}
      {stats?.topProperties && stats.topProperties.length > 0 && (
        <div className="bg-dark-card border border-gold-500/15 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gold-500/10">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-500" />
              {t.dashboard.owner.mostViewed}
            </h2>
          </div>
          <div className="divide-y divide-gold-500/8">
            {stats.topProperties.map((p, i) => {
              const imgs = Array.isArray(p.images) ? p.images : [];
              return (
                <div key={p.id} className="flex items-center gap-4 px-5 py-4">
                  <span className="text-lg font-display font-bold text-gold-500/40 w-6 shrink-0">
                    {i + 1}
                  </span>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-3 shrink-0">
                    {imgs[0] ? (
                      <img src={imgs[0]} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🏠</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/properties/${p.id}`} className="text-sm font-medium hover:text-gold-400 transition-colors truncate block">
                      {p.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{p.city}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">Visualizações</p>
                      <p className="font-semibold flex items-center gap-1 justify-end">
                        <Eye className="w-3.5 h-3.5 text-gold-500" /> {p.viewCount}
                      </p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-muted-foreground">Reservas</p>
                      <p className="font-semibold flex items-center gap-1 justify-end">
                        <CalendarCheck className="w-3.5 h-3.5 text-green-400" /> {p.bookingCount}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Preço</p>
                      <p className="font-display font-semibold text-gold-500">{formatPrice(Number(p.price), locale)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
