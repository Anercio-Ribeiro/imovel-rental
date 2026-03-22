"use client";
// ============================================================
// src/app/(dashboard)/dashboard/owner/properties/page.tsx
// ============================================================
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n, formatPrice } from "@/i18n";
import {
  useOwnerProperties, useDeleteProperty,
  useTogglePropertyStatus,
} from "@/hooks/useProperties";
import { Pagination } from "@/components/shared/Pagination";
import { PropertyGridSkeleton } from "@/components/shared/Skeleton";
import { toast } from "sonner";
import {
  PlusSquare, Pencil, Trash2, EyeOff, Eye,
  BedDouble, Bath, Maximize2, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OwnerPropertiesPage() {
  const { t, locale } = useI18n();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOwnerProperties(page);
  const deleteProperty = useDeleteProperty();
  const toggleStatus = useTogglePropertyStatus();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const properties = data?.data ?? [];

  const handleDelete = async (id: string) => {
    try {
      await deleteProperty.mutateAsync(id);
      toast.success("Imóvel eliminado");
      setConfirmDelete(null);
    } catch {
      toast.error(t.common.error);
    }
  };

  const handleToggle = async (id: string, current: string) => {
    const next = current === "active" ? "inactive" : "active";
    try {
      await toggleStatus.mutateAsync({ id, status: next });
      toast.success(next === "active" ? "Imóvel activado" : "Imóvel desactivado");
    } catch {
      toast.error(t.common.error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{t.dashboard.owner.properties}</h1>
          {data && <p className="text-muted-foreground text-sm mt-1">{data.total} imóveis</p>}
        </div>
        <Link href="/dashboard/owner/add" className="btn-primary flex items-center gap-2">
          <PlusSquare className="w-4 h-4" />
          {t.dashboard.owner.addProperty}
        </Link>
      </div>

      {isLoading ? (
        <PropertyGridSkeleton count={4} />
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-dark-card border border-gold-500/10 rounded-2xl">
          <p className="text-5xl mb-4">🏠</p>
          <p className="text-lg font-medium mb-2">Ainda não tem imóveis</p>
          <p className="text-muted-foreground text-sm mb-6">Adicione o seu primeiro imóvel agora</p>
          <Link href="/dashboard/owner/add" className="btn-primary inline-flex items-center gap-2">
            <PlusSquare className="w-4 h-4" /> Adicionar imóvel
          </Link>
        </div>
      ) : (
        <div className="bg-dark-card border border-gold-500/15 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-500/10 bg-dark-2">
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium">Imóvel</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium hidden md:table-cell">Detalhes</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium">Preço</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium hidden sm:table-cell">Estado</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium hidden lg:table-cell">Stats</th>
                <th className="px-5 py-3 text-right text-xs uppercase tracking-wider text-muted-foreground font-medium">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/8">
              {properties.map((p) => {
                const imgs = Array.isArray(p.images) ? p.images : [];
                const title = locale === "en" && p.titleEn ? p.titleEn : p.title;
                return (
                  <tr key={p.id} className="hover:bg-dark-2/50 transition-colors">
                    {/* Property */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-dark-3 shrink-0">
                          {imgs[0] ? (
                            <Image src={imgs[0]} alt={title} width={56} height={56} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">🏠</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/properties/${p.id}`} className="text-sm font-medium hover:text-gold-400 transition-colors line-clamp-1">
                            {title}
                          </Link>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {p.city}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Details */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{p.bedrooms}</span>
                        <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms}</span>
                        <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" />{p.area}m²</span>
                      </div>
                    </td>
                    {/* Price */}
                    <td className="px-4 py-4">
                      <p className="text-sm font-display font-semibold text-gold-500">
                        {formatPrice(Number(p.price), locale)}
                      </p>
                      <p className="text-xs text-muted-foreground">{p.listingType === "rent" ? "/mês" : "total"}</p>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className={cn("badge", p.status === "active" ? "badge-active" : "badge-inactive")}>
                        {t.property.status[p.status as keyof typeof t.property.status] ?? p.status}
                      </span>
                    </td>
                    {/* Stats */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="text-xs text-muted-foreground flex flex-col gap-1">
                        <span>👁 {p.viewCount} visualizações</span>
                        <span>📅 {p.bookingCount} reservas</span>
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/owner/edit/${p.id}`}
                          className="w-8 h-8 rounded-lg bg-dark-surface border border-gold-500/15 flex items-center justify-center text-muted-foreground hover:text-gold-400 hover:border-gold-500/30 transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleToggle(p.id, p.status)}
                          className="w-8 h-8 rounded-lg bg-dark-surface border border-gold-500/15 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-gold-500/30 transition-all">
                          {p.status === "active" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        {confirmDelete === p.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleDelete(p.id)}
                              className="px-2 py-1 text-xs bg-red-500/15 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/25 transition-all">
                              Sim
                            </button>
                            <button onClick={() => setConfirmDelete(null)}
                              className="px-2 py-1 text-xs bg-dark-surface border border-gold-500/15 text-muted-foreground rounded-lg hover:text-foreground transition-all">
                              Não
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(p.id)}
                            className="w-8 h-8 rounded-lg bg-dark-surface border border-gold-500/15 flex items-center justify-center text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          total={data.total}
          pageSize={data.pageSize}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
