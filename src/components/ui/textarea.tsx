// src/components/ui/textarea.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-gold-500/15 bg-dark-surface px-3 py-2 text-sm",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-gold-500/50 focus-visible:ring-1 focus-visible:ring-gold-500/30",
        "disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
