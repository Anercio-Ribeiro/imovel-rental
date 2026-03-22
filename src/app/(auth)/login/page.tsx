"use client";
// ============================================================
// src/app/(auth)/login/page.tsx
// ============================================================
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useI18n } from "@/i18n";
import { Building2, Mail, Lock, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email, password, redirect: false,
      });
      if (res?.error) {
        toast.error(t.auth.errors.invalidCredentials);
      } else {
        toast.success("Bem-vindo de volta!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)" }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Building2 className="w-6 h-6 text-gold-500" />
            <span className="font-display text-2xl font-bold text-gold-500">Imo<span className="text-foreground font-normal">velo</span></span>
          </Link>
          <h1 className="font-display text-2xl font-semibold">{t.auth.loginTitle}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t.auth.loginSub}</p>
        </div>

        <div className="bg-dark-card border border-gold-500/15 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{t.auth.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@exemplo.com"
                  className="input-base pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{t.auth.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-base pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {t.auth.login}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {t.auth.noAccount}{" "}
          <Link href="/register" className="text-gold-400 hover:text-gold-300 transition-colors">
            {t.auth.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
