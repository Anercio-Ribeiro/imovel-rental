// "use client";
// // src/app/(dashboard)/dashboard/admin/hero/page.tsx
// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { Plus, Trash2, Eye, EyeOff, GripVertical, Image, Type, AlignLeft, MousePointer, Check } from "lucide-react";
// import type { HeroSlide } from "@/lib/db/schema";

// const EMPTY: Omit<HeroSlide, "id"|"createdAt"|"updatedAt"> = {
//   title: "Encontre a sua casa dos sonhos",
//   subtitle: "Imóveis premium para venda e arrendamento em Angola",
//   imageUrl: "",
//   buttonLabel: "Explorar imóveis",
//   buttonUrl: "/properties",
//   showTitle: true, showSubtitle: true, showButton: true, showImage: false,
//   active: true, order: 0,
// };

// export default function AdminHeroPage() {
//   const qc = useQueryClient();
//   const { data: slides = [], isLoading } = useQuery<HeroSlide[]>({
//     queryKey: ["hero-slides"],
//     queryFn: async () => {
//       const r = await fetch("/api/hero-slides");
//       return r.json();
//     },
//   });

//   const [editing, setEditing] = useState<Partial<HeroSlide> | null>(null);

//   const save = useMutation({
//     mutationFn: async (slide: Partial<HeroSlide>) => {
//       const method = slide.id ? "PUT" : "POST";
//       const r = await fetch("/api/hero-slides", { method, headers: { "Content-Type":"application/json" }, body: JSON.stringify(slide) });
//       return r.json();
//     },
//     onSuccess: () => { qc.invalidateQueries({ queryKey: ["hero-slides"] }); setEditing(null); toast.success("Guardado!"); },
//     onError: () => toast.error("Erro ao guardar"),
//   });

//   const del = useMutation({
//     mutationFn: async (id: string) => {
//       await fetch("/api/hero-slides", { method: "DELETE", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ id }) });
//     },
//     onSuccess: () => { qc.invalidateQueries({ queryKey: ["hero-slides"] }); toast.success("Eliminado"); },
//   });

//   const toggle = useMutation({
//     mutationFn: async (slide: HeroSlide) => {
//       await fetch("/api/hero-slides", { method: "PUT", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ ...slide, active: !slide.active }) });
//     },
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["hero-slides"] }),
//   });

//   const f = editing ?? {};

//   return (
//     <div className="flex flex-col gap-6 max-w-4xl">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Hero da Página Inicial</h1>
//           <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Gerir os slides do hero — texto, imagens e botões dinâmicos</p>
//         </div>
//         <button onClick={() => setEditing(EMPTY)} className="btn-primary flex items-center gap-2">
//           <Plus className="w-4 h-4" /> Novo slide
//         </button>
//       </div>

//       {/* Slides list */}
//       <div className="flex flex-col gap-3">
//         {isLoading ? (
//           Array.from({length:2}).map((_,i) => (
//             <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "var(--bg-surface)" }} />
//           ))
//         ) : slides.length === 0 ? (
//           <div className="text-center py-16 rounded-2xl" style={{ background: "var(--bg-surface)" }}>
//             <p className="text-4xl mb-3">🖼️</p>
//             <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Nenhum slide criado</p>
//             <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Crie o primeiro slide para personalizar o hero</p>
//           </div>
//         ) : (
//           slides.map((slide) => (
//             <div key={slide.id} className="flex items-center gap-4 p-4 rounded-2xl"
//               style={{ background: "var(--bg-card)", border: `1px solid ${slide.active ? "var(--brand)" : "var(--border-color)"}`, opacity: slide.active ? 1 : 0.6 }}>
//               <GripVertical className="w-4 h-4 shrink-0" style={{ color: "var(--text-subtle)" }} />

//               {/* Preview thumbnail */}
//               <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-2xl"
//                 style={{ background: "var(--bg-surface)" }}>
//                 {slide.imageUrl && slide.showImage
//                   ? <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
//                   : "🖼️"}
//               </div>

//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>
//                   {slide.title || "(sem título)"}
//                 </p>
//                 <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
//                   {slide.subtitle || "(sem subtítulo)"}
//                 </p>
//                 <div className="flex gap-2 mt-1">
//                   {(["showTitle","showSubtitle","showButton","showImage"] as const).map(k => {
//                     const labels: Record<string,string> = { showTitle:"Título", showSubtitle:"Subtítulo", showButton:"Botão", showImage:"Imagem" };
//                     return (
//                       <span key={k} className="text-[10px] px-1.5 py-0.5 rounded"
//                         style={{
//                           background: slide[k] ? "rgba(255,56,92,0.10)" : "var(--bg-surface)",
//                           color: slide[k] ? "var(--brand)" : "var(--text-subtle)",
//                         }}>
//                         {labels[k]}
//                       </span>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 shrink-0">
//                 <button onClick={() => toggle.mutate(slide)}
//                   className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
//                   style={{ background: slide.active ? "rgba(255,56,92,0.10)" : "var(--bg-surface)", color: slide.active ? "var(--brand)" : "var(--text-muted)" }}>
//                   {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                 </button>
//                 <button onClick={() => setEditing(slide)}
//                   className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
//                   style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}>
//                   Editar
//                 </button>
//                 <button onClick={() => { if (confirm("Eliminar?")) del.mutate(slide.id); }}
//                   className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
//                   style={{ background: "rgba(239,68,68,0.10)", color: "#EF4444" }}>
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Edit modal */}
//       {editing !== null && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)} />
//           <div className="relative z-10 w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
//             style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
//             <h2 className="font-display text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>
//               {f.id ? "Editar slide" : "Novo slide"}
//             </h2>

//             <div className="flex flex-col gap-4">
//               {/* Title */}
//               <label className="flex flex-col gap-1.5">
//                 <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
//                   <Type className="w-3.5 h-3.5" /> Título
//                   <button onClick={() => setEditing(p => ({ ...p!, showTitle: !p!.showTitle }))}
//                     className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-xs"
//                     style={{ background: f.showTitle ? "rgba(255,56,92,0.10)" : "var(--bg-surface)", color: f.showTitle ? "var(--brand)" : "var(--text-subtle)" }}>
//                     {f.showTitle ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
//                     {f.showTitle ? "Visível" : "Oculto"}
//                   </button>
//                 </div>
//                 <input value={f.title ?? ""} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))}
//                   placeholder="Título principal" className="input-base" />
//               </label>

//               {/* Subtitle */}
//               <label className="flex flex-col gap-1.5">
//                 <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
//                   <AlignLeft className="w-3.5 h-3.5" /> Subtítulo
//                   <button onClick={() => setEditing(p => ({ ...p!, showSubtitle: !p!.showSubtitle }))}
//                     className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-xs"
//                     style={{ background: f.showSubtitle ? "rgba(255,56,92,0.10)" : "var(--bg-surface)", color: f.showSubtitle ? "var(--brand)" : "var(--text-subtle)" }}>
//                     {f.showSubtitle ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
//                     {f.showSubtitle ? "Visível" : "Oculto"}
//                   </button>
//                 </div>
//                 <textarea value={f.subtitle ?? ""} onChange={e => setEditing(p => ({ ...p!, subtitle: e.target.value }))}
//                   rows={2} placeholder="Subtítulo ou descrição" className="input-base resize-none" />
//               </label>

//               {/* Image URL */}
//               <label className="flex flex-col gap-1.5">
//                 <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
//                   <Image className="w-3.5 h-3.5" /> Imagem de fundo (URL)
//                   <button onClick={() => setEditing(p => ({ ...p!, showImage: !p!.showImage }))}
//                     className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-xs"
//                     style={{ background: f.showImage ? "rgba(255,56,92,0.10)" : "var(--bg-surface)", color: f.showImage ? "var(--brand)" : "var(--text-subtle)" }}>
//                     {f.showImage ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
//                     {f.showImage ? "Visível" : "Oculto"}
//                   </button>
//                 </div>
//                 <input value={f.imageUrl ?? ""} onChange={e => setEditing(p => ({ ...p!, imageUrl: e.target.value }))}
//                   placeholder="https://... (Azure ou Unsplash)" className="input-base" />
//                 {f.imageUrl && f.showImage && (
//                   <img src={f.imageUrl} alt="" className="h-24 w-full object-cover rounded-xl mt-1" />
//                 )}
//               </label>

//               {/* Button */}
//               <label className="flex flex-col gap-1.5">
//                 <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
//                   <MousePointer className="w-3.5 h-3.5" /> Botão
//                   <button onClick={() => setEditing(p => ({ ...p!, showButton: !p!.showButton }))}
//                     className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-xs"
//                     style={{ background: f.showButton ? "rgba(255,56,92,0.10)" : "var(--bg-surface)", color: f.showButton ? "var(--brand)" : "var(--text-subtle)" }}>
//                     {f.showButton ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
//                     {f.showButton ? "Visível" : "Oculto"}
//                   </button>
//                 </div>
//                 <div className="flex gap-2">
//                   <input value={f.buttonLabel ?? ""} onChange={e => setEditing(p => ({ ...p!, buttonLabel: e.target.value }))}
//                     placeholder="Texto do botão" className="input-base flex-1" />
//                   <input value={f.buttonUrl ?? ""} onChange={e => setEditing(p => ({ ...p!, buttonUrl: e.target.value }))}
//                     placeholder="/properties" className="input-base flex-1" />
//                 </div>
//               </label>

//               {/* Active + Order */}
//               <div className="flex gap-3">
//                 <label className="flex items-center gap-2 cursor-pointer flex-1 p-3 rounded-xl"
//                   style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
//                   <div className="w-10 h-6 rounded-full relative transition-all"
//                     style={{ background: f.active ? "var(--brand)" : "var(--border-strong)" }}
//                     onClick={() => setEditing(p => ({ ...p!, active: !p!.active }))}>
//                     <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
//                       style={{ left: f.active ? "calc(100% - 20px)" : 4 }} />
//                   </div>
//                   <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
//                     {f.active ? "Activo" : "Inactivo"}
//                   </span>
//                 </label>
//                 <label className="flex flex-col gap-1 flex-1">
//                   <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Ordem</span>
//                   <input type="number" min={0} value={f.order ?? 0}
//                     onChange={e => setEditing(p => ({ ...p!, order: Number(e.target.value) }))}
//                     className="input-base" />
//                 </label>
//               </div>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button onClick={() => setEditing(null)} className="btn-secondary flex-1">Cancelar</button>
//               <button onClick={() => save.mutate(f as HeroSlide)}
//                 disabled={save.isPending}
//                 className="btn-primary flex-1 flex items-center justify-center gap-2">
//                 <Check className="w-4 h-4" />
//                 {save.isPending ? "A guardar…" : "Guardar slide"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




"use client";
// src/app/(dashboard)/dashboard/admin/hero/page.tsx
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, GripVertical, Image, Type, AlignLeft, MousePointer, Check, Upload, X, Loader2 } from "lucide-react";
import type { HeroSlide } from "@/lib/db/schema";

const EMPTY: Omit<HeroSlide, "id"|"createdAt"|"updatedAt"> = {
  title: "Encontre a sua casa dos sonhos",
  subtitle: "Imóveis premium para venda e arrendamento em Angola",
  imageUrl: "",
  buttonLabel: "Explorar imóveis",
  buttonUrl: "/properties",
  showTitle: true, showSubtitle: true, showButton: true, showImage: false,
  active: true, order: 0,
};

export default function AdminHeroPage() {
  const qc = useQueryClient();
  const { data: slides = [], isLoading } = useQuery<HeroSlide[]>({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const r = await fetch("/api/hero-slides");
      return r.json();
    },
  });

  const [editing, setEditing] = useState<Partial<HeroSlide> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const save = useMutation({
    mutationFn: async (slide: Partial<HeroSlide>) => {
      const method = slide.id ? "PUT" : "POST";
      const r = await fetch("/api/hero-slides", { method, headers: { "Content-Type":"application/json" }, body: JSON.stringify(slide) });
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hero-slides"] });
      setEditing(null);
      setImagePreview(null);
      toast.success("Guardado!");
    },
    onError: () => toast.error("Erro ao guardar"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      await fetch("/api/hero-slides", { method: "DELETE", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ id }) });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hero-slides"] }); toast.success("Eliminado"); },
  });

  const toggle = useMutation({
    mutationFn: async (slide: HeroSlide) => {
      await fetch("/api/hero-slides", { method: "PUT", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ ...slide, active: !slide.active }) });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hero-slides"] }),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    // Upload to Azure
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Erro no upload");
      setEditing(p => ({ ...p!, imageUrl: data.url, showImage: true }));
      toast.success("Imagem carregada!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao carregar imagem";
      toast.error(message);
      setImagePreview(null);
      setEditing(p => ({ ...p!, imageUrl: "" }));
    } finally {
      setUploadingImage(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setEditing(p => ({ ...p!, imageUrl: "", showImage: false }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openEdit = (slide: Partial<HeroSlide>) => {
    setEditing(slide);
    setImagePreview(slide.imageUrl && slide.imageUrl !== "" ? slide.imageUrl : null);
  };

  const closeEdit = () => {
    setEditing(null);
    setImagePreview(null);
  };

  const f = editing ?? {};
  const currentImage = imagePreview ?? f.imageUrl ?? "";

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Hero da Página Inicial</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Gerir os slides do hero — texto, imagens e botões dinâmicos</p>
        </div>
        <button onClick={() => openEdit(EMPTY)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo slide
        </button>
      </div>

      {/* Slides list */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({length:2}).map((_,i) => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "var(--bg-surface)" }} />
          ))
        ) : slides.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: "var(--bg-surface)" }}>
            <p className="text-4xl mb-3">🖼️</p>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Nenhum slide criado</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Crie o primeiro slide para personalizar o hero</p>
          </div>
        ) : (
          slides.map((slide) => (
            <div key={slide.id} className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: "var(--bg-card)", border: `1px solid ${slide.active ? "var(--brand)" : "var(--border-color)"}`, opacity: slide.active ? 1 : 0.6 }}>
              <GripVertical className="w-4 h-4 shrink-0" style={{ color: "var(--text-subtle)" }} />

              {/* Preview thumbnail */}
              <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-2xl"
                style={{ background: "var(--bg-surface)" }}>
                {slide.imageUrl && slide.showImage
                  ? <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                  : "🖼️"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>
                  {slide.title || "(sem título)"}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {slide.subtitle || "(sem subtítulo)"}
                </p>
                <div className="flex gap-2 mt-1">
                  {(["showTitle","showSubtitle","showButton","showImage"] as const).map(k => {
                    const labels: Record<string,string> = { showTitle:"Título", showSubtitle:"Subtítulo", showButton:"Botão", showImage:"Imagem" };
                    return (
                      <span key={k} className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          background: slide[k] ? "rgba(255,56,92,0.10)" : "var(--bg-surface)",
                          color: slide[k] ? "var(--brand)" : "var(--text-subtle)",
                        }}>
                        {labels[k]}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggle.mutate(slide)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: slide.active ? "rgba(255,56,92,0.10)" : "var(--bg-surface)", color: slide.active ? "var(--brand)" : "var(--text-muted)" }}>
                  {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(slide)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}>
                  Editar
                </button>
                <button onClick={() => { if (confirm("Eliminar?")) del.mutate(slide.id); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: "rgba(239,68,68,0.10)", color: "#EF4444" }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeEdit} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
            <h2 className="font-display text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>
              {f.id ? "Editar slide" : "Novo slide"}
            </h2>

            <div className="flex flex-col gap-4">
              {/* Title */}
              <label className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  <Type className="w-3.5 h-3.5" /> Título
                  <button onClick={() => setEditing(p => ({ ...p!, showTitle: !p!.showTitle }))}
                    className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                    style={{ background: f.showTitle ? "rgba(255,56,92,0.10)" : "var(--bg-surface)", color: f.showTitle ? "var(--brand)" : "var(--text-subtle)" }}>
                    {f.showTitle ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {f.showTitle ? "Visível" : "Oculto"}
                  </button>
                </div>
                <input value={f.title ?? ""} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))}
                  placeholder="Título principal" className="input-base" />
              </label>

              {/* Subtitle */}
              <label className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  <AlignLeft className="w-3.5 h-3.5" /> Subtítulo
                  <button onClick={() => setEditing(p => ({ ...p!, showSubtitle: !p!.showSubtitle }))}
                    className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                    style={{ background: f.showSubtitle ? "rgba(255,56,92,0.10)" : "var(--bg-surface)", color: f.showSubtitle ? "var(--brand)" : "var(--text-subtle)" }}>
                    {f.showSubtitle ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {f.showSubtitle ? "Visível" : "Oculto"}
                  </button>
                </div>
                <textarea value={f.subtitle ?? ""} onChange={e => setEditing(p => ({ ...p!, subtitle: e.target.value }))}
                  rows={2} placeholder="Subtítulo ou descrição" className="input-base resize-none" />
              </label>

              {/* Image Upload */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  <Image className="w-3.5 h-3.5" /> Imagem de fundo
                  {currentImage && (
                    <button onClick={() => setEditing(p => ({ ...p!, showImage: !p!.showImage }))}
                      className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                      style={{ background: f.showImage ? "rgba(255,56,92,0.10)" : "var(--bg-surface)", color: f.showImage ? "var(--brand)" : "var(--text-subtle)" }}>
                      {f.showImage ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {f.showImage ? "Visível" : "Oculto"}
                    </button>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {currentImage ? (
                  /* Preview with overlay controls */
                  <div className="relative rounded-xl overflow-hidden group"
                    style={{ border: "1px solid var(--border-color)" }}>
                    <img
                      src={currentImage}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                    {/* Uploading overlay */}
                    {uploadingImage && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                        style={{ background: "rgba(0,0,0,0.55)" }}>
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                        <span className="text-white text-xs font-medium">A carregar…</span>
                      </div>
                    )}
                    {/* Hover actions */}
                    {!uploadingImage && (
                      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(0,0,0,0.45)" }}>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                          style={{ background: "rgba(255,255,255,0.20)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.30)" }}>
                          <Upload className="w-3.5 h-3.5" /> Substituir
                        </button>
                        <button
                          onClick={handleRemoveImage}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={{ background: "rgba(239,68,68,0.80)", backdropFilter: "blur(4px)", border: "1px solid rgba(239,68,68,0.50)", color: "#fff" }}>
                          <X className="w-3.5 h-3.5" /> Remover
                        </button>
                      </div>
                    )}
                    {/* Status badge */}
                    {!uploadingImage && f.imageUrl && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}>
                        <Check className="w-3 h-3 text-green-400" /> Guardada no Azure
                      </div>
                    )}
                  </div>
                ) : (
                  /* Drop zone / upload button */
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex flex-col items-center justify-center gap-3 w-full h-36 rounded-xl transition-all"
                    style={{
                      border: "2px dashed var(--border-color)",
                      background: "var(--bg-surface)",
                      color: "var(--text-muted)",
                    }}
                    onDragOver={e => { e.preventDefault(); }}
                    onDrop={async e => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (!file) return;
                      // Simulate change event flow
                      const dt = new DataTransfer();
                      dt.items.add(file);
                      if (fileInputRef.current) {
                        fileInputRef.current.files = dt.files;
                        fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
                      }
                    }}
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-7 h-7 animate-spin" style={{ color: "var(--brand)" }} />
                        <span className="text-sm font-medium">A carregar imagem…</span>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: "rgba(255,56,92,0.10)" }}>
                          <Upload className="w-5 h-5" style={{ color: "var(--brand)" }} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                            Clique ou arraste uma imagem
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                            JPEG, PNG, WebP ou GIF · máx. 10 MB
                          </p>
                        </div>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Button */}
              <label className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  <MousePointer className="w-3.5 h-3.5" /> Botão
                  <button onClick={() => setEditing(p => ({ ...p!, showButton: !p!.showButton }))}
                    className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                    style={{ background: f.showButton ? "rgba(255,56,92,0.10)" : "var(--bg-surface)", color: f.showButton ? "var(--brand)" : "var(--text-subtle)" }}>
                    {f.showButton ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {f.showButton ? "Visível" : "Oculto"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <input value={f.buttonLabel ?? ""} onChange={e => setEditing(p => ({ ...p!, buttonLabel: e.target.value }))}
                    placeholder="Texto do botão" className="input-base flex-1" />
                  <input value={f.buttonUrl ?? ""} onChange={e => setEditing(p => ({ ...p!, buttonUrl: e.target.value }))}
                    placeholder="/properties" className="input-base flex-1" />
                </div>
              </label>

              {/* Active + Order */}
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer flex-1 p-3 rounded-xl"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
                  <div className="w-10 h-6 rounded-full relative transition-all"
                    style={{ background: f.active ? "var(--brand)" : "var(--border-strong)" }}
                    onClick={() => setEditing(p => ({ ...p!, active: !p!.active }))}>
                    <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                      style={{ left: f.active ? "calc(100% - 20px)" : 4 }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {f.active ? "Activo" : "Inactivo"}
                  </span>
                </label>
                <label className="flex flex-col gap-1 flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Ordem</span>
                  <input type="number" min={0} value={f.order ?? 0}
                    onChange={e => setEditing(p => ({ ...p!, order: Number(e.target.value) }))}
                    className="input-base" />
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={closeEdit} className="btn-secondary flex-1">Cancelar</button>
              <button
                onClick={() => save.mutate(f as HeroSlide)}
                disabled={save.isPending || uploadingImage}
                className="btn-primary flex-1 flex items-center justify-center gap-2">
                {save.isPending
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> A guardar…</>
                  : <><Check className="w-4 h-4" /> Guardar slide</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}