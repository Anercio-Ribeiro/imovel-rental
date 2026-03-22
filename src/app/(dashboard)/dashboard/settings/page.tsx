"use client";
// src/app/(dashboard)/dashboard/settings/page.tsx
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { Loader2, User, Lock, Globe, Bell } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { t, locale, setLocale } = useI18n();
  const [loading, setLoading] = useState(false);

  const [name, setName]   = useState(session?.user?.name ?? "");
  const [phone, setPhone] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In production: PATCH /api/users/me
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Perfil actualizado!");
    } catch {
      toast.error(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Definições</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerir o seu perfil e preferências</p>
      </div>

      {/* Profile */}
      <section className="bg-dark-card border border-gold-500/15 rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-400 mb-5">
          <User className="w-4 h-4" /> Perfil
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gold-500/10">
          <div className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center text-dark-DEFAULT text-xl font-bold overflow-hidden">
            {session?.user?.image
              ? <img src={session.user.image} alt="" className="w-full h-full object-cover" />
              : getInitials(session?.user?.name ?? "U")}
          </div>
          <div>
            <p className="font-medium">{session?.user?.name}</p>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            <span className={cn("mt-1 badge text-xs",
              session?.user?.role === "admin" ? "badge-pending" :
              session?.user?.role === "owner" ? "badge-approved" : "badge-active")}>
              {session?.user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Nome completo</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-base" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Telefone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-base" placeholder="+244 9XX XXX XXX" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t.common.save}
            </button>
          </div>
        </form>
      </section>

      {/* Language */}
      <section className="bg-dark-card border border-gold-500/15 rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-400 mb-5">
          <Globe className="w-4 h-4" /> Idioma
        </h2>
        <div className="flex gap-3">
          {(["pt", "en"] as const).map((l) => (
            <button key={l} onClick={() => { setLocale(l); toast.success(`Idioma alterado para ${l === "pt" ? "Português" : "English"}`); }}
              className={cn(
                "flex-1 py-3 rounded-xl border text-sm font-medium transition-all",
                locale === l
                  ? "border-gold-500/50 bg-gold-500/10 text-gold-400"
                  : "border-gold-500/15 text-muted-foreground hover:border-gold-500/25"
              )}>
              {l === "pt" ? "🇦🇴 Português" : "🇬🇧 English"}
            </button>
          ))}
        </div>
      </section>

      {/* Password */}
      <section className="bg-dark-card border border-gold-500/15 rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-400 mb-5">
          <Lock className="w-4 h-4" /> Palavra-passe
        </h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Nova palavra-passe</label>
              <input type="password" placeholder="••••••••" className="input-base" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Confirmar</label>
              <input type="password" placeholder="••••••••" className="input-base" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="btn-secondary text-sm">Alterar palavra-passe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
