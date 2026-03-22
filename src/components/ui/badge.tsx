// src/components/ui/badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gold-500 text-dark-DEFAULT hover:bg-gold-400",
        secondary: "border-transparent bg-dark-surface text-foreground hover:bg-dark-surface/80",
        destructive: "border-transparent bg-red-500/15 text-red-400 border-red-500/20",
        outline: "text-foreground border-gold-500/20",
        success: "border-transparent bg-green-500/15 text-green-400 border-green-500/20",
        warning: "border-transparent bg-gold-500/15 text-gold-400 border-gold-500/20",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
