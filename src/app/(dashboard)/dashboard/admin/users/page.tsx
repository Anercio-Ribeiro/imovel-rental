"use client";
// ============================================================
// src/app/(dashboard)/dashboard/admin/users/page.tsx
// ============================================================
import { useState } from "react";
import { useI18n } from "@/i18n";
import { useAdminUsers } from "@/hooks/useProperties";
import { Pagination } from "@/components/shared/Pagination";
import { Users, Shield, Building2, User } from "lucide-react";
import { cn, formatDateShort, getInitials } from "@/lib/utils";

export default function AdminUsersPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers(page);
  const users = data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
          <Users className="w-6 h-6 text-gold-500" />
          {t.dashboard.admin.users}
        </h1>
        {data && <p className="text-muted-foreground text-sm mt-1">{data.total} utilizadores registados</p>}
      </div>

      <div className="bg-dark-card border border-gold-500/15 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold-500/10 bg-dark-2">
              <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium">Utilizador</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium hidden md:table-cell">Contacto</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium">Papel</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium hidden sm:table-cell">Registado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-500/8">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-dark-surface rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : users.map((user) => (
                  <tr key={user.id} className="hover:bg-dark-2/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                          user.role === "admin" ? "bg-gold-500/20 text-gold-400" :
                          user.role === "owner" ? "bg-green-500/20 text-green-400" :
                          "bg-blue-500/20 text-blue-400")}>
                          {user.avatar
                            ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            : getInitials(user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-sm text-muted-foreground">{user.phone ?? "—"}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("badge",
                        user.role === "admin" ? "badge-pending" :
                        user.role === "owner" ? "badge-approved" : "badge-active")}>
                        {user.role === "admin" && <Shield className="w-3 h-3" />}
                        {user.role === "owner" && <Building2 className="w-3 h-3" />}
                        {user.role === "tenant" && <User className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <p className="text-sm text-muted-foreground">{formatDateShort(user.createdAt)}</p>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

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
