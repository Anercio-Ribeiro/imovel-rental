"use client";
// ============================================================
// src/components/shared/ImageUploader.tsx
// Drag & drop uploader → Azure Blob Storage
// ============================================================
import { useRef, useState } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Upload, X, Loader2, ImageIcon, AlertCircle, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

interface Props {
  value: string[];           // current uploaded URLs
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUploader({ value, onChange, maxImages = 10, className }: Props) {
  const { t } = useI18n();
  const { images, isUploading, canAddMore, addFiles, removeImage, uploadedUrls } =
    useImageUpload(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Keep parent in sync whenever uploadedUrls changes
  const prevUrls = useRef<string>("");
  const urlsStr = uploadedUrls.join(",");
  if (urlsStr !== prevUrls.current) {
    prevUrls.current = urlsStr;
    onChange(uploadedUrls);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
      e.target.value = ""; // reset so same file can be re-added
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Drop zone */}
      {canAddMore && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
            dragOver
              ? "border-gold-500 bg-gold-500/8"
              : "border-gold-500/20 hover:border-gold-500/40 hover:bg-gold-500/4"
          )}>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleInput}
          />
          <div className="flex flex-col items-center gap-3">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-gold-500" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">
                {isUploading ? "A carregar..." : t.form.property.uploadPhotos}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{t.form.property.uploadHint}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {images.filter((i) => !i.error).length} / {maxImages} imagens
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-dark-3">
              {/* Preview image */}
              <img
                src={img.preview || img.url}
                alt={img.name}
                className={cn(
                  "w-full h-full object-cover transition-opacity",
                  img.uploading && "opacity-50"
                )}
              />

              {/* Upload spinner */}
              {img.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-DEFAULT/50">
                  <Loader2 className="w-6 h-6 text-gold-500 animate-spin" />
                </div>
              )}

              {/* Error */}
              {img.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/20 gap-1">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-xs text-red-400 text-center px-1 line-clamp-2">{img.error}</p>
                </div>
              )}

              {/* Primary badge */}
              {idx === 0 && !img.uploading && !img.error && (
                <div className="absolute bottom-1.5 left-1.5 bg-gold-500 text-dark-DEFAULT text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Principal
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-dark-DEFAULT/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Help text */}
      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          A primeira imagem será a imagem principal do anúncio.
        </p>
      )}
    </div>
  );
}
