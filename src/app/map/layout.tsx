// src/app/map/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mapa de Imóveis | Imovelo",
  description: "Explore imóveis no mapa interactivo",
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
