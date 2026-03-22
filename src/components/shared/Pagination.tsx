"use client";
// ============================================================
// src/components/shared/Pagination.tsx
// ============================================================
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
  const { t } = useI18n();
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Generate page numbers with ellipsis
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
      <p className="text-sm text-muted-foreground">
        {from}–{to} {t.common.of} {total} {t.common.results}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center border text-sm transition-all",
            "border-gold-500/15 text-muted-foreground hover:border-gold-500/30 hover:text-foreground",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}>
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center text-sm border transition-all",
                p === page
                  ? "bg-gold-500 border-gold-500 text-dark-DEFAULT font-semibold"
                  : "border-gold-500/15 text-muted-foreground hover:border-gold-500/30 hover:text-foreground"
              )}>
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center border text-sm transition-all",
            "border-gold-500/15 text-muted-foreground hover:border-gold-500/30 hover:text-foreground",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
