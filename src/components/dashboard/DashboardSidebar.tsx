"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Building2, PlusSquare, BarChart3,
  CalendarCheck, Heart, Users, Settings, Shield, Sparkles,
} from "lucide-react";
import type { UserRole } from "@/types";

interface Props { role: UserRole }

export function DashboardSidebar({ role }: Props) {
  const { t } = useI18n();
  const pathname = usePathname();

  const ownerLinks = [
    { href: "/dashboard",                    label: t.dashboard.overview,           icon: LayoutDashboard, exact: true },
    { href: "/dashboard/owner/properties",   label: t.dashboard.owner.properties,   icon: Building2 },
    { href: "/dashboard/owner/add",          label: t.dashboard.owner.addProperty,  icon: PlusSquare },
    { href: "/dashboard/owner/bookings",     label: "Reservas recebidas",            icon: CalendarCheck },
    { href: "/dashboard/owner/stats",        label: t.dashboard.owner.stats,         icon: BarChart3 },
  ];

  const tenantLinks = [
    { href: "/dashboard",                    label: t.dashboard.overview,            icon: LayoutDashboard, exact: true },
    { href: "/dashboard/tenant/bookings",    label: t.dashboard.tenant.bookings,     icon: CalendarCheck },
    { href: "/dashboard/tenant/favorites",   label: t.dashboard.tenant.favorites,    icon: Heart },
  ];

  const adminLinks = [
    { href: "/dashboard",                    label: t.dashboard.overview,            icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/properties",   label: t.dashboard.admin.properties,    icon: Building2 },
    { href: "/dashboard/admin/users",        label: t.dashboard.admin.users,         icon: Users },
    { href: "/dashboard/admin/bookings",     label: t.dashboard.admin.bookings,      icon: CalendarCheck },
    { href: "/dashboard/admin/hero",         label: "Hero da Página Inicial",        icon: Sparkles },
  ];

  const links = role === "admin" ? adminLinks : role === "owner" ? ownerLinks : tenantLinks;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-[calc(100vh-64px)]"
      style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border-color)" }}>

      {/* Role badge */}
      <div className="px-4 py-5" style={{ borderBottom: "1px solid var(--border-color)" }}>
        <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
          role === "admin" ? "bg-gold-500/15 text-gold-500" :
          role === "owner" ? "bg-green-500/15 text-green-600 dark:text-green-400" :
          "bg-blue-500/15 text-blue-600 dark:text-blue-400")}>
          {role === "admin" && <Shield className="w-3 h-3" />}
          {role === "owner" && <Building2 className="w-3 h-3" />}
          {role === "tenant" && <Users className="w-3 h-3" />}
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: active ? "var(--brand-bg)" : "transparent",
                color: active ? "var(--brand)" : "var(--text-muted)",
                fontWeight: active ? 600 : 400,
                borderLeft: `2px solid ${active ? "var(--brand)" : "transparent"}`,
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = "var(--text-primary)"; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border-color)" }}>
        <Link href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}>
          <Settings className="w-4 h-4" />
          Definições
        </Link>
      </div>
    </aside>
  );
}
