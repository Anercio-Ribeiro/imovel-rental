// src/app/(public)/properties/[id]/not-found.tsx
import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-6">🏠</p>
        <h1 className="font-display text-2xl font-semibold mb-2">Imóvel não encontrado</h1>
        <p className="text-muted-foreground mb-8">
          Este imóvel pode ter sido removido ou o link está incorreto.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/properties" className="btn-primary flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Ver imóveis
          </Link>
          <Link href="/" className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Início
          </Link>
        </div>
      </div>
    </div>
  );
}
