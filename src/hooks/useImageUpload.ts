"use client";
// ============================================================
// src/hooks/useImageUpload.ts
// Hook para fazer upload de imagens para Azure Blob Storage
// ============================================================
import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface UploadedImage {
  id: string;        // local temp ID for the UI
  url: string;       // final Azure URL
  preview: string;   // object URL for preview before upload
  name: string;
  size: number;
  uploading: boolean;
  error?: string;
}

const MAX_IMAGES = 10;

export function useImageUpload(initialUrls: string[] = []) {
  const [images, setImages] = useState<UploadedImage[]>(
    initialUrls.map((url, i) => ({
      id: `initial-${i}`,
      url,
      preview: url,
      name: url.split("/").pop() ?? "image",
      size: 0,
      uploading: false,
    }))
  );

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(err.message ?? "Upload failed");
    }

    const data = await res.json() as { url: string };
    return data.url;
  }, []);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const available = MAX_IMAGES - images.filter((i) => !i.error).length;

    if (available <= 0) {
      toast.error(`Máximo de ${MAX_IMAGES} imagens atingido`);
      return;
    }

    const toUpload = fileArray.slice(0, available);

    // Create previews immediately so UI is responsive
    const previews: UploadedImage[] = toUpload.map((file) => ({
      id: `upload-${Date.now()}-${Math.random()}`,
      url: "",
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      uploading: true,
    }));

    setImages((prev) => [...prev, ...previews]);

    // Upload each file
    await Promise.all(
      previews.map(async (preview, i) => {
        try {
          const url = await uploadFile(toUpload[i]);
          if (!url) throw new Error("No URL returned");

          setImages((prev) =>
            prev.map((img) =>
              img.id === preview.id
                ? { ...img, url, uploading: false }
                : img
            )
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Erro no upload";
          toast.error(`Erro ao carregar ${toUpload[i].name}: ${message}`);
          setImages((prev) =>
            prev.map((img) =>
              img.id === preview.id
                ? { ...img, uploading: false, error: message }
                : img
            )
          );
        }
      })
    );
  }, [images, uploadFile]);

  const removeImage = useCallback(async (id: string) => {
    const img = images.find((i) => i.id === id);
    if (!img) return;

    // Revoke object URL to prevent memory leaks
    if (img.preview.startsWith("blob:")) {
      URL.revokeObjectURL(img.preview);
    }

    // Delete from Azure if uploaded
    if (img.url && img.url.startsWith("https://")) {
      fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: img.url }),
      }).catch(console.error);
    }

    setImages((prev) => prev.filter((i) => i.id !== id));
  }, [images]);

  const reorderImages = useCallback((from: number, to: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  // Only URLs that have been successfully uploaded
  const uploadedUrls = images
    .filter((i) => i.url && !i.uploading && !i.error)
    .map((i) => i.url);

  const isUploading = images.some((i) => i.uploading);
  const count = images.filter((i) => !i.error).length;

  return {
    images,
    uploadedUrls,
    isUploading,
    count,
    canAddMore: count < MAX_IMAGES,
    addFiles,
    removeImage,
    reorderImages,
  };
}
