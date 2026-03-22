"use client";
// ============================================================
// src/components/dashboard/AdminDashboardOverview.tsx
// ============================================================
import Link from "next/link";
import { useI18n } from "@/i18n";
import { useAdminStats, useAdminUsers } from "@/hooks/useProperties";
import { StatCardSkeleton } from "@/components/shared/Skeleton";
import { Users, Building2, CalendarCheck, TrendingUp, Shield, UserCheck } from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";

interface Props { userName: string }

export function AdminDashboardOverview({ userName }: Props) {
  const { t } = useI18n();
  const { data: stats, isLoading } = useAdminStats();
  const { data: usersData } = useAdminUsers(1);

  const recentUsers = usersData?.data?.slice(0, 8) ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-gold-500" />
            <h1 className="font-display text-2xl font-semibold">
              {t.dashboard.admin.title}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {t.dashboard.welcome}, <span className="text-gold-400">{userName}</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : [
              { label: t.dashboard.admin.totalUsers, value: stats?.totalUsers ?? 0, icon: Users, sub: `+${stats?.newUsersThisMonth ?? 0} este mês`, color: "text-blue-400" },
              { label: "Proprietários", value: stats?.totalOwners ?? 0, icon: Building2, sub: `${stats?.totalTenants ?? 0} inquilinos`, color: "text-green-400" },
              { label: t.dashboard.admin.totalProperties, value: stats?.totalProperties ?? 0, icon: Building2, sub: `+${stats?.newPropertiesThisMonth ?? 0} este mês`, color: "text-gold-400" },
              { label: t.dashboard.admin.totalBookings, value: stats?.totalBookings ?? 0, icon: CalendarCheck, sub: "Total acumulado", color: "text-purple-400" },
            ].map(({ label, value, icon: Icon, sub, color }) => (
              <div key={label} className="bg-dark-card border border-gold-500/15 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                  <Icon className={cn("w-5 h-5", color)} />
                </div>
                <p className="font-display text-3xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </div>
            ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/dashboard/admin/users", label: "Gerir utilizadores", icon: Users, desc: "Ver, editar e remover utilizadores" },
          { href: "/dashboard/admin/properties", label: "Gerir imóveis", icon: Building2, desc: "Aprovar, desactivar e remover imóveis" },
          { href: "/dashboard/admin/bookings", label: "Gerir reservas", icon: CalendarCheck, desc: "Supervisionar todas as reservas" },
        ].map(({ href, label, icon: Icon, desc }) => (
          <Link key={href} href={href}
            className="bg-dark-card border border-gold-500/15 rounded-xl p-5 hover:border-gold-500/30 transition-all group">
            <Icon className="w-6 h-6 text-gold-500 mb-3" />
            <h3 className="font-semibold text-sm mb-1 group-hover:text-gold-400 transition-colors">{label}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent users */}
      <div className="bg-dark-card border border-gold-500/15 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-500/10">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-gold-500" />
            Utilizadores recentes
          </h2>
          <Link href="/dashboard/admin/users" className="text-xs text-gold-400 hover:text-gold-300">Ver todos →</Link>
        </div>
        <div className="divide-y divide-gold-500/8">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="w-9 h-9 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-sm font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <span className={cn("badge shrink-0",
                user.role === "admin" ? "badge-pending" :
                user.role === "owner" ? "badge-approved" : "badge-active")}>
                {user.role}
              </span>
              <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                {formatDateShort(user.createdAt)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
