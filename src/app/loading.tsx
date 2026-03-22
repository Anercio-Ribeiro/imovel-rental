// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">A carregar...</p>
      </div>
    </div>
  );
}
