// ============================================================
// src/app/not-found.tsx
// ============================================================
import Link from "next/link";
import { Building2, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="text-center">
        <div className="font-display text-8xl font-bold text-gold-500/20 mb-4">404</div>
        <h1 className="font-display text-2xl font-semibold mb-2">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8">A página que procura não existe ou foi movida.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <Home className="w-4 h-4" /> Início
          </Link>
          <Link href="/properties" className="btn-secondary flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Ver imóveis
          </Link>
        </div>
      </div>
    </div>
  );
}
