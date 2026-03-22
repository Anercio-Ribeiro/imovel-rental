"use client";
// src/components/shared/ShareButton.tsx
import { useState } from "react";
import { Share2, Check, Link2, Twitter, Facebook } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  url?: string;
  className?: string;
}

export function ShareButton({ title, url, className }: Props) {
  const [open, setOpen] = useState(false);
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copiado!");
      setOpen(false);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({ title, url: shareUrl });
    } else {
      setOpen(!open);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={shareNative}
        className={cn("w-9 h-9 rounded-full bg-dark-DEFAULT/70 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-dark-card transition-all", className)}>
        <Share2 className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-dark-card border border-gold-500/20 rounded-xl p-2 min-w-[160px] shadow-xl z-10">
          <button onClick={copyLink}
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-dark-surface rounded-lg w-full transition-all">
            <Link2 className="w-4 h-4 text-gold-500" /> Copiar link
          </button>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-dark-surface rounded-lg w-full transition-all">
            <Twitter className="w-4 h-4 text-sky-400" /> Twitter/X
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-dark-surface rounded-lg w-full transition-all">
            <Facebook className="w-4 h-4 text-blue-400" /> Facebook
          </a>
        </div>
      )}
    </div>
  );
}
