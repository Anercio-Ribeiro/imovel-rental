"use client";
// ============================================================
// src/components/layout/Navbar.tsx — Airbnb-style white navbar
// ============================================================
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useI18n } from "@/i18n";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home, Map, LayoutDashboard, LogIn, UserPlus, LogOut,
  Menu, X, ChevronDown, Building2, Heart, CalendarCheck,
  PlusSquare, BarChart3, Users, Globe, Shield, User,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session } = useSession();
  const { t, locale, setLocale } = useI18n();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;
  const role = user?.role;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border-color)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--brand)" }}>
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg"
              style={{ color: "var(--brand)" }}>
              imo<span style={{ color: "var(--text-primary)" }}>velo</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/properties", label: t.nav.properties, icon: Home },
              { href: "/map",        label: t.nav.map,        icon: Map  },
            ].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  pathname.startsWith(href)
                    ? "font-semibold"
                    : "hover:bg-[var(--bg-surface)]"
                )}
                style={{ color: pathname.startsWith(href) ? "var(--brand)" : "var(--text-muted)" }}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Language */}
            <div className="hidden sm:flex items-center rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--border-color)" }}>
              {(["pt", "en"] as const).map((l) => (
                <button key={l} onClick={() => setLocale(l)}
                  className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all"
                  style={{
                    background: locale === l ? "var(--text-primary)" : "transparent",
                    color: locale === l ? "var(--bg-card)" : "var(--text-muted)",
                  }}>
                  {l}
                </button>
              ))}
            </div>

            {user ? (
              <>
                {role === "owner" && (
                  <Link href="/dashboard/owner/add"
                    className="hidden sm:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                    style={{ background: "var(--brand)", color: "#fff" }}>
                    <PlusSquare className="w-3.5 h-3.5" />
                    Anunciar
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-2xl border px-2 py-1.5 transition-all hover:shadow-md"
                      style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
                      <Menu className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden"
                        style={{ background: "var(--brand)" }}>
                        {user.image
                          ? <img src={user.image} alt="" className="w-full h-full object-cover" />
                          : getInitials(user.name ?? "U")}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                    <div className="px-3 py-2 border-b" style={{ borderColor: "var(--border-color)" }}>
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{user.email}</p>
                    </div>

                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer text-sm">
                        <LayoutDashboard className="w-4 h-4" /> {t.nav.dashboard}
                      </Link>
                    </DropdownMenuItem>

                    {role === "owner" && <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/owner/properties" className="flex items-center gap-2 cursor-pointer text-sm">
                          <Building2 className="w-4 h-4" /> {t.nav.myProperties}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/owner/add" className="flex items-center gap-2 cursor-pointer text-sm">
                          <PlusSquare className="w-4 h-4" /> {t.nav.addProperty}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/owner/stats" className="flex items-center gap-2 cursor-pointer text-sm">
                          <BarChart3 className="w-4 h-4" /> {t.dashboard.owner.stats}
                        </Link>
                      </DropdownMenuItem>
                    </>}

                    {role === "tenant" && <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/tenant/bookings" className="flex items-center gap-2 cursor-pointer text-sm">
                          <CalendarCheck className="w-4 h-4" /> {t.nav.myBookings}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/tenant/favorites" className="flex items-center gap-2 cursor-pointer text-sm">
                          <Heart className="w-4 h-4" /> {t.nav.myFavorites}
                        </Link>
                      </DropdownMenuItem>
                    </>}

                    {role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/admin" className="flex items-center gap-2 cursor-pointer text-sm">
                          <Shield className="w-4 h-4" /> Admin
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator style={{ background: "var(--border-color)" }} />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 cursor-pointer text-sm text-red-500 focus:text-red-500">
                      <LogOut className="w-4 h-4" /> {t.nav.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="hidden sm:block text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  {t.nav.login}
                </Link>
                <Link href="/register"
                  className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-white"
                  style={{ background: "var(--brand)" }}>
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.nav.register}</span>
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button className="md:hidden p-2 rounded-xl transition-all"
              style={{ border: "1px solid var(--border-color)" }}
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-1"
          style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
          {[
            { href: "/properties", label: t.nav.properties, icon: Home },
            { href: "/map",        label: t.nav.map,        icon: Map  },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: pathname.startsWith(href) ? "var(--brand-bg)" : "transparent",
                color: pathname.startsWith(href) ? "var(--brand)" : "var(--text-primary)",
              }}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <div className="flex items-center gap-3 px-4 pt-2">
            <ThemeToggle />
            <Globe className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            {(["pt", "en"] as const).map((l) => (
              <button key={l} onClick={() => { setLocale(l); setMobileOpen(false); }}
                className="px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all border"
                style={{
                  borderColor: locale === l ? "var(--brand)" : "var(--border-color)",
                  color: locale === l ? "var(--brand)" : "var(--text-muted)",
                  background: locale === l ? "var(--brand-bg)" : "transparent",
                }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
