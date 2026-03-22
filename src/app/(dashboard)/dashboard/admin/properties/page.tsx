"use client";
// ============================================================
// src/app/(dashboard)/dashboard/admin/properties/page.tsx
// ============================================================
import { useState } from "react";
import Link from "next/link";
import { useI18n, formatPrice } from "@/i18n";
import { useAdminProperties, useDeleteProperty, useTogglePropertyStatus } from "@/hooks/useProperties";
import { Pagination } from "@/components/shared/Pagination";
import { toast } from "sonner";
import { Building2, Eye, EyeOff, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPropertiesPage() {
  const { t, locale } = useI18n();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProperties(page);
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

  const handleToggle = async (id: string, status: string) => {
    try {
      await toggleStatus.mutateAsync({ id, status: status === "active" ? "inactive" : "active" });
      toast.success("Estado actualizado");
    } catch {
      toast.error(t.common.error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-gold-500" />
          {t.dashboard.admin.properties}
        </h1>
        {data && <p className="text-muted-foreground text-sm mt-1">{data.total} imóveis na plataforma</p>}
      </div>

      <div className="bg-dark-card border border-gold-500/15 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold-500/10 bg-dark-2">
              <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium">Imóvel</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium hidden md:table-cell">Proprietário</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium">Preço</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium hidden sm:table-cell">Estado</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium hidden lg:table-cell">Stats</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-muted-foreground font-medium">Acções</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-500/8">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-dark-surface rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : properties.map((p) => {
                  const owner = p.owner as { name?: string } | null;
                  const imgs = Array.isArray(p.images) ? p.images : [];
                  return (
                    <tr key={p.id} className="hover:bg-dark-2/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-3 shrink-0">
                            {imgs[0] ? (
                              <img src={imgs[0]} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">🏠</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                            <p className="text-xs text-muted-foreground">{p.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-sm text-muted-foreground">{owner?.name ?? "—"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-display font-semibold text-gold-500">
                          {formatPrice(Number(p.price), locale)}
                        </p>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className={cn("badge", p.status === "active" ? "badge-active" : "badge-inactive")}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="text-xs text-muted-foreground">👁 {p.viewCount} · 📅 {p.bookingCount}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/properties/${p.id}`} target="_blank"
                            className="w-8 h-8 rounded-lg bg-dark-surface border border-gold-500/15 flex items-center justify-center text-muted-foreground hover:text-gold-400 transition-all">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => handleToggle(p.id, p.status)}
                            className="w-8 h-8 rounded-lg bg-dark-surface border border-gold-500/15 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                            {p.status === "active" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          {confirmDelete === p.id ? (
                            <div className="flex gap-1">
                              <button onClick={() => handleDelete(p.id)} className="px-2 py-1 text-xs bg-red-500/15 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/25 transition-all">Sim</button>
                              <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 text-xs bg-dark-surface border border-gold-500/15 text-muted-foreground rounded-lg transition-all">Não</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(p.id)}
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

      {data && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}
    </div>
  );
}
