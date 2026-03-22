// src/components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-gold-500/15 bg-dark-surface px-3 py-2 text-sm",
        "placeholder:text-muted-foreground focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30",
        "disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
