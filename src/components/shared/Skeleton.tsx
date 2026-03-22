// src/components/shared/Skeleton.tsx
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl animate-pulse", className)}
      style={{ background: "var(--bg-surface)" }} />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
      <div className="aspect-[4/3] animate-pulse" style={{ background: "var(--bg-surface)" }} />
      <div className="p-4 flex flex-col gap-2.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-5 w-1/3 mt-1" />
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}
