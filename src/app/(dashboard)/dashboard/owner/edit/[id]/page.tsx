"use client";
// ============================================================
// src/app/(dashboard)/dashboard/owner/edit/[id]/page.tsx
// ============================================================
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useI18n } from "@/i18n";
import { useProperty, useUpdateProperty } from "@/hooks/useProperties";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditPropertyPage() {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property, isLoading } = useProperty(id);
  const updateProperty = useUpdateProperty();

  const [form, setForm] = useState({
    title: "", titleEn: "",
    description: "", descriptionEn: "",
    price: "", area: "",
    bedrooms: "1", bathrooms: "1", parkingSpots: "0",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title,
        titleEn: property.titleEn ?? "",
        description: property.description,
        descriptionEn: property.descriptionEn ?? "",
        price: String(property.price),
        area: String(property.area),
        bedrooms: String(property.bedrooms),
        bathrooms: String(property.bathrooms),
        parkingSpots: String(property.parkingSpots),
        status: property.status as "active" | "inactive",
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProperty.mutateAsync({
        id,
        data: {
          ...form,
          price: Number(form.price),
          area: Number(form.area),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          parkingSpots: Number(form.parkingSpots),
        } as never,
      });
      toast.success(t.form.property.editSuccess);
      router.push("/dashboard/owner/properties");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t.common.error);
    }
  };

  const field = (key: keyof typeof form, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Imóvel não encontrado</p>
        <Link href="/dashboard/owner/properties" className="btn-primary mt-4 inline-flex">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/owner/properties" className="w-8 h-8 rounded-lg border border-gold-500/15 flex items-center justify-center hover:border-gold-500/30 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-display text-2xl font-semibold">{t.form.property.editTitle}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-card border border-gold-500/15 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { key: "title", label: t.form.property.titlePt, full: false },
            { key: "titleEn", label: t.form.property.titleEn, full: false },
            { key: "description", label: t.form.property.descriptionPt, full: true, textarea: true },
            { key: "descriptionEn", label: t.form.property.descriptionEn, full: true, textarea: true },
            { key: "price", label: t.form.property.price, type: "number", full: false },
            { key: "area", label: t.form.property.area, type: "number", full: false },
            { key: "bedrooms", label: t.form.property.bedrooms, type: "number", full: false },
            { key: "bathrooms", label: t.form.property.bathrooms, type: "number", full: false },
          ].map(({ key, label, full, type, textarea }) => (
            <div key={key} className={`flex flex-col gap-1.5 ${full ? "md:col-span-2" : ""}`}>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</label>
              {textarea ? (
                <textarea
                  value={form[key as keyof typeof form]}
                  onChange={(e) => field(key as keyof typeof form, e.target.value)}
                  rows={3}
                  className="input-base resize-none"
                />
              ) : (
                <input
                  type={type ?? "text"}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => field(key as keyof typeof form, e.target.value)}
                  className="input-base"
                />
              )}
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Estado</label>
            <select value={form.status} onChange={(e) => field("status", e.target.value)} className="input-base">
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-gold-500/10">
          <Link href="/dashboard/owner/properties" className="btn-secondary">{t.common.cancel}</Link>
          <button type="submit" disabled={updateProperty.isPending} className="btn-primary flex items-center gap-2">
            {updateProperty.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {t.common.save}
          </button>
        </div>
      </form>
    </div>
  );
}
