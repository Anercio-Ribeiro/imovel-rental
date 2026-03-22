// src/components/shared/EmptyState.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-16 px-4 bg-dark-card border border-gold-500/10 rounded-2xl",
      className
    )}>
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm mb-6 max-w-xs">{description}</p>
      )}
      {actionLabel && (
        actionHref ? (
          <Link href={actionHref} className="btn-primary">{actionLabel}</Link>
        ) : (
          <button onClick={onAction} className="btn-primary">{actionLabel}</button>
        )
      )}
    </div>
  );
}
