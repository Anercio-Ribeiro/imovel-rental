"use client";
// ============================================================
// src/app/(auth)/register/page.tsx
// ============================================================
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useI18n } from "@/i18n";
import { authApi } from "@/lib/api";
import { Building2, Mail, Lock, User, Phone, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "", role: "tenant" as "tenant" | "owner",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = t.auth.errors.required;
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = t.auth.errors.invalidEmail;
    if (form.password.length < 8) e.password = t.auth.errors.passwordMin;
    if (form.password !== form.confirmPassword) e.confirmPassword = t.auth.errors.passwordMatch;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.register({ name: form.name, email: form.email, password: form.password, phone: form.phone, role: form.role });
      toast.success("Conta criada! A iniciar sessão...");
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 70% 30%, rgba(201,168,76,0.06) 0%, transparent 60%)" }} />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Building2 className="w-6 h-6 text-gold-500" />
            <span className="font-display text-2xl font-bold text-gold-500">Imo<span className="text-foreground font-normal">velo</span></span>
          </Link>
          <h1 className="font-display text-2xl font-semibold">{t.auth.registerTitle}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t.auth.registerSub}</p>
        </div>

        <div className="bg-dark-card border border-gold-500/15 rounded-2xl p-6">
          {/* Role picker */}
          <div className="flex gap-2 p-1 bg-dark-2 rounded-xl mb-5">
            {(["tenant", "owner"] as const).map((r) => (
              <button key={r} type="button" onClick={() => field("role", r)}
                className={cn("flex-1 py-2.5 rounded-lg text-sm transition-all font-medium",
                  form.role === r ? "bg-gold-500 text-dark-DEFAULT" : "text-muted-foreground hover:text-foreground")}>
                {r === "tenant" ? t.auth.roleTenant : t.auth.roleOwner}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Name */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={form.name} onChange={(e) => field("name", e.target.value)}
                  placeholder={t.auth.name} className={cn("input-base pl-10", errors.name && "border-red-500/50")} />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={form.email} onChange={(e) => field("email", e.target.value)}
                  placeholder={t.auth.email} className={cn("input-base pl-10", errors.email && "border-red-500/50")} />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={form.phone} onChange={(e) => field("phone", e.target.value)}
                placeholder={`${t.auth.phone} (opcional)`} className="input-base pl-10" />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" value={form.password} onChange={(e) => field("password", e.target.value)}
                  placeholder={t.auth.password} className={cn("input-base pl-10", errors.password && "border-red-500/50")} />
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" value={form.confirmPassword} onChange={(e) => field("confirmPassword", e.target.value)}
                  placeholder={t.auth.confirmPassword} className={cn("input-base pl-10", errors.confirmPassword && "border-red-500/50")} />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {t.auth.register}
            </button>
          </form>

          <p className="text-[11px] text-center text-muted-foreground mt-4">{t.auth.terms}</p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {t.auth.hasAccount}{" "}
          <Link href="/login" className="text-gold-400 hover:text-gold-300 transition-colors">{t.auth.login}</Link>
        </p>
      </div>
    </div>
  );
}
