// ============================================================
// src/app/layout.tsx — Root layout
// ============================================================
import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { themeScript } from "@/components/shared/ThemeProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Imovelo — Imóveis de Luxo", template: "%s | Imovelo" },
  description: "Plataforma de imóveis para venda e arrendamento em Angola. Encontre a sua casa dos sonhos.",
  keywords: ["imóveis", "arrendamento", "venda", "Angola", "Luanda", "real estate"],
  openGraph: {
    title: "Imovelo",
    description: "Imóveis de luxo para venda e arrendamento",
    type: "website",
    locale: "pt_AO",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        {/* Runs before React hydrates — sets dark class with no flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
