"use client";
// src/app/error.tsx
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="font-display text-2xl font-semibold mb-2">Algo correu mal</h1>
        <p className="text-muted-foreground text-sm mb-2">
          {error.message || "Ocorreu um erro inesperado. Por favor tente novamente."}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/60 mb-6 font-mono">ID: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-primary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
          <Link href="/" className="btn-secondary flex items-center gap-2">
            <Home className="w-4 h-4" />
            Início
          </Link>
        </div>
      </div>
    </div>
  );
}
