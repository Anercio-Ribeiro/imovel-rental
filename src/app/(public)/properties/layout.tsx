// src/app/(public)/properties/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imóveis | Imovelo",
  description: "Pesquise e encontre imóveis para venda e arrendamento em Angola",
};

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
