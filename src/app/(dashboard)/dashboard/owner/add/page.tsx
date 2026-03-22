"use client";
// src/app/(dashboard)/dashboard/owner/add/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n";
import { useCreateProperty } from "@/hooks/useProperties";
import { ImageUploader } from "@/components/shared/ImageUploader";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const LocationPicker = dynamic(
  () => import("@/components/map/LocationPicker").then((m) => m.LocationPicker),
  { ssr: false, loading: () => <div className="h-64 rounded-xl animate-pulse" style={{ background: "var(--bg-surface)" }} /> }
);

const STEPS = ["basic", "location", "details", "amenities", "photos"] as const;
type Step = (typeof STEPS)[number];

const defaultForm = {
  // Basic
  title: "",
  description: "",
  type: "apartment" as const,
  listingType: "rent" as const,
  price: "",
  priceUnit: "month" as const,
  // Location
  address: "",
  city: "",
  province: "",
  country: "Angola",
  zipCode: "",
  latitude: "-8.8368",
  longitude: "13.2343",
  // Details
  area: "",
  bedrooms: "1",
  bathrooms: "1",
  parkingSpots: "0",
  totalFloors: "",
  yearBuilt: "",
  // Amenities
  furnished: false,
  petFriendly: false,
  hasPool: false,
  hasGarden: false,
  hasGym: false,
  hasSecurity: false,
  hasElevator: false,
  // Images
  images: [] as string[],
};

export default function AddPropertyPage() {
  const { t } = useI18n();
  const router = useRouter();
  const createProperty = useCreateProperty();
  const [step, setStep] = useState<Step>("basic");
  const [form, setForm] = useState(defaultForm);

  const field = (key: keyof typeof form, value: unknown) =>
    setForm((p) => ({ ...p, [key]: value }));

  const stepIdx = STEPS.indexOf(step);

  const handleLocationChange = (lat: number, lng: number, address?: string) => {
    setForm((p) => ({
      ...p,
      latitude: String(lat),
      longitude: String(lng),
      ...(address ? { address } : {}),
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.city) {
      toast.error("Preencha os campos obrigatórios: título, preço e cidade");
      return;
    }
    try {
      await createProperty.mutateAsync({
        ...form,
        titleEn: form.title,      // use same title for EN fallback
        descriptionEn: form.description,
        price: Number(form.price),
        area: Number(form.area) || 0,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        parkingSpots: Number(form.parkingSpots),
        totalFloors: form.totalFloors ? Number(form.totalFloors) : undefined,
        yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      } as never);
      toast.success(t.form.property.success);
      router.push("/dashboard/owner/properties");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t.common.error);
    }
  };

  const stepLabels: Record<Step, string> = {
    basic: "Informações",
    location: "Localização",
    details: "Detalhes",
    amenities: "Comodidades",
    photos: "Fotografias",
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">{t.form.property.title}</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Preencha os campos para publicar o seu imóvel
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => i < stepIdx && setStep(s)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                s === step
                  ? "bg-gold-500 border-gold-500 text-[#0D0D0F]"
                  : i < stepIdx
                  ? "border-gold-500/40 text-gold-500 cursor-pointer hover:border-gold-500"
                  : "border-transparent text-muted-foreground"
              )}
              style={s !== step && i >= stepIdx ? { borderColor: "var(--border-color)", color: "var(--text-muted)" } : {}}>
              {i < stepIdx ? <CheckCircle className="w-3 h-3" /> : <span>{i + 1}</span>}
              {stepLabels[s]}
            </button>
            {i < STEPS.length - 1 && (
              <div className="w-3 h-px" style={{ background: "var(--border-color)" }} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-6"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>

        {/* ── BASIC ─────────────────────────────────── */}
        {step === "basic" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>
                  Tipo de negócio *
                </label>
                <select value={form.listingType} onChange={(e) => field("listingType", e.target.value)} className="input-base">
                  <option value="rent">Arrendamento</option>
                  <option value="sale">Venda</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>
                  Tipologia *
                </label>
                <select value={form.type} onChange={(e) => field("type", e.target.value)} className="input-base">
                  {Object.entries(t.property.type).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>Título *</label>
              <input value={form.title} onChange={(e) => field("title", e.target.value)}
                required className="input-base" placeholder="Ex: Apartamento T3 espaçoso em Talatona" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>Descrição *</label>
              <textarea rows={5} value={form.description} onChange={(e) => field("description", e.target.value)}
                required className="input-base resize-none"
                placeholder="Descreva o imóvel: localização, acabamentos, pontos fortes..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>
                  Preço (AOA) *
                </label>
                <input type="number" min={0} value={form.price} onChange={(e) => field("price", e.target.value)}
                  required className="input-base" placeholder="Ex: 150000" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>
                  Unidade
                </label>
                <select value={form.priceUnit} onChange={(e) => field("priceUnit", e.target.value)} className="input-base">
                  <option value="month">Por mês</option>
                  <option value="total">Preço total</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── LOCATION ──────────────────────────────── */}
        {step === "location" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Clique no mapa para definir a localização exacta do imóvel. Pode também arrastar o pin.
            </p>

            <LocationPicker
              lat={Number(form.latitude)}
              lng={Number(form.longitude)}
              onChange={handleLocationChange}
              className="h-72 w-full"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>
                  Morada *
                </label>
                <input value={form.address} onChange={(e) => field("address", e.target.value)}
                  required className="input-base" placeholder="Preenchido automaticamente ao clicar no mapa" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>Cidade *</label>
                <input value={form.city} onChange={(e) => field("city", e.target.value)}
                  required className="input-base" placeholder="Ex: Luanda" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>Província *</label>
                <input value={form.province} onChange={(e) => field("province", e.target.value)}
                  required className="input-base" placeholder="Ex: Luanda" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>País</label>
                <input value={form.country} onChange={(e) => field("country", e.target.value)} className="input-base" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>Código postal</label>
                <input value={form.zipCode} onChange={(e) => field("zipCode", e.target.value)} className="input-base" />
              </div>
            </div>
          </div>
        )}

        {/* ── DETAILS ───────────────────────────────── */}
        {step === "details" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: "area",         label: "Área (m²)" },
              { key: "bedrooms",     label: "Quartos" },
              { key: "bathrooms",    label: "Casas de banho" },
              { key: "parkingSpots", label: "Estacionamento" },
              { key: "totalFloors",  label: "Total de pisos" },
              { key: "yearBuilt",    label: "Ano de construção" },
            ].map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>{label}</label>
                <input type="number" min={0}
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => field(key as keyof typeof form, e.target.value)}
                  className="input-base" />
              </div>
            ))}
          </div>
        )}

        {/* ── AMENITIES ─────────────────────────────── */}
        {step === "amenities" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {([
              ["furnished",   "Mobilado"],
              ["petFriendly", "Aceita animais"],
              ["hasPool",     "Piscina"],
              ["hasGarden",   "Jardim"],
              ["hasGym",      "Ginásio"],
              ["hasSecurity", "Segurança 24h"],
              ["hasElevator", "Elevador"],
            ] as const).map(([key, label]) => {
              const checked = form[key as keyof typeof form] as boolean;
              return (
                <label key={key}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none",
                  )}
                  style={{
                    borderColor: checked ? "var(--gold)" : "var(--border-color)",
                    background: checked ? "var(--gold-bg)" : "var(--bg-surface)",
                    color: checked ? "var(--gold)" : "var(--text-muted)",
                  }}>
                  <input type="checkbox" checked={checked}
                    onChange={(e) => field(key as keyof typeof form, e.target.checked)}
                    className="sr-only" />
                  <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0"
                    style={{ borderColor: checked ? "var(--gold)" : "var(--border-strong)", background: checked ? "var(--gold)" : "transparent" }}>
                    {checked && <span className="text-[10px] font-bold" style={{ color: "#0D0D0F" }}>✓</span>}
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </label>
              );
            })}
          </div>
        )}

        {/* ── PHOTOS ────────────────────────────────── */}
        {step === "photos" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Carregue até 10 fotografias · JPEG, PNG, WebP · Máximo 10 MB por imagem
            </p>
            <ImageUploader value={form.images} onChange={(urls) => field("images", urls)} maxImages={10} />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-5" style={{ borderTop: "1px solid var(--border-color)" }}>
          {stepIdx > 0 ? (
            <button type="button" onClick={() => setStep(STEPS[stepIdx - 1])} className="btn-secondary">
              ← Anterior
            </button>
          ) : <div />}

          {stepIdx < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep(STEPS[stepIdx + 1])} className="btn-primary">
              Próximo →
            </button>
          ) : (
            <button type="button" onClick={handleSubmit}
              disabled={createProperty.isPending}
              className="btn-primary flex items-center gap-2">
              {createProperty.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Publicar imóvel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
