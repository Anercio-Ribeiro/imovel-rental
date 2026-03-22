"use client";
// src/components/properties/PropertyImageGallery.tsx
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  images: string[];
  title: string;
}

export function PropertyImageGallery({ images, title }: Props) {
  const [current, setCurrent]     = useState(0);
  const [lightbox, setLightbox]   = useState(false);

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-dark-3 rounded-xl flex items-center justify-center text-5xl">
        🏠
      </div>
    );
  }

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  return (
    <>
      {/* Main gallery */}
      <div className="relative group rounded-2xl overflow-hidden bg-dark-3"
           style={{ height: "clamp(240px, 50vw, 480px)" }}>
        <Image
          src={images[current]}
          alt={`${title} — ${current + 1}`}
          fill
          className="object-cover"
          priority={current === 0}
          sizes="(max-width: 1024px) 100vw, 70vw"
        />

        {/* Overlay controls */}
        {images.length > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-dark-DEFAULT/70 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-dark-card">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-dark-DEFAULT/70 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-dark-card">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Expand */}
        <button onClick={() => setLightbox(true)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-dark-DEFAULT/70 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-dark-card">
          <Expand className="w-4 h-4" />
        </button>

        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-dark-DEFAULT/70 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs text-white/80 border border-white/10">
          {current + 1} / {images.length}
        </div>

        {/* Dot indicators */}
        {images.length > 1 && images.length <= 8 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={cn("rounded-full transition-all",
                  i === current ? "w-5 h-2 bg-gold-500" : "w-2 h-2 bg-white/40 hover:bg-white/70")} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={cn(
                "w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all",
                i === current ? "border-gold-500 opacity-100" : "border-transparent opacity-60 hover:opacity-90"
              )}>
              <img src={img} alt={`${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-card border border-gold-500/20 flex items-center justify-center hover:bg-dark-surface transition-all">
            <X className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-card border border-gold-500/20 flex items-center justify-center hover:bg-dark-surface transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <img src={images[current]} alt={title}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-card border border-gold-500/20 flex items-center justify-center hover:bg-dark-surface transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
            {current + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
