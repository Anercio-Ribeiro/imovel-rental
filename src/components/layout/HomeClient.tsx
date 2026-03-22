// "use client";
// import { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { useQuery } from "@tanstack/react-query";
// import { useI18n, formatPrice } from "@/i18n";
// import { Navbar } from "@/components/layout/Navbar";
// import { PropertyCard } from "@/components/properties/PropertyCard";
// import { Pagination } from "@/components/shared/Pagination";
// import { PropertyGridSkeleton } from "@/components/shared/Skeleton";
// import { useProperties } from "@/hooks/useProperties";
// import {
//   Search, Map, LayoutGrid, ArrowRight, ChevronDown,
//   Home, Building, TreePine, Waves, Star, Sparkles,
//   SlidersHorizontal, X, MapPin, Users, CheckCircle2, ChevronLeft, ChevronRight as ChevronRightIcon,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import dynamic from "next/dynamic";
// import type { Property, PropertyFilters } from "@/types";
// import type { HeroSlide } from "@/lib/db/schema";

// const PropertyMap = dynamic(
//   () => import("@/components/map/PropertyMap").then((m) => m.PropertyMap),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="w-full h-full rounded-3xl animate-pulse"
//         style={{ background: "var(--bg-surface)" }} />
//     ),
//   }
// );

// type ViewMode = "grid" | "map";

// interface Props {
//   stats: { totalProperties: number; totalUsers: number; totalCities: number };
//   initialFeatured: Property[];
// }

// // ── Category tabs ────────────────────────────────────────────
// const CATEGORIES = [
//   { icon: Home,     label: "Apartamentos", type: "apartment" },
//   { icon: Building, label: "Moradias",     type: "house" },
//   { icon: Star,     label: "Villas",       type: "villa" },
//   { icon: Sparkles, label: "Coberturas",   type: "penthouse" },
//   { icon: TreePine, label: "Terrenos",     type: "land" },
//   { icon: Waves,    label: "Studios",      type: "studio" },
// ];

// // ── Sidebar filters ───────────────────────────────────────────
// function SidebarFilters({ filters, onChange, onClose }: {
//   filters: PropertyFilters;
//   onChange: (f: PropertyFilters) => void;
//   onClose?: () => void;
// }) {
//   const set = (k: keyof PropertyFilters, v: unknown) =>
//     onChange({ ...filters, [k]: v || undefined, page: 1 });

//   const activeCount = Object.entries(filters).filter(
//     ([k, v]) => !["page","pageSize","sortBy"].includes(k) && v !== undefined && v !== ""
//   ).length;

//   return (
//     <div className="flex flex-col gap-5 h-full">
//       <div className="flex items-center justify-between">
//         <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Filtros</p>
//         <div className="flex items-center gap-2">
//           {activeCount > 0 && (
//             <button onClick={() => onChange({ page: 1, pageSize: filters.pageSize ?? 8 })}
//               className="text-xs font-semibold" style={{ color: "var(--brand)" }}>
//               Limpar ({activeCount})
//             </button>
//           )}
//           {onClose && (
//             <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center"
//               style={{ background: "var(--bg-surface)" }}>
//               <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-0.5">
//         {/* Listing type */}
//         <div>
//           <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Negócio</p>
//           <div className="flex gap-2">
//             {[
//               { v: undefined, l: "Todos" },
//               { v: "rent",    l: "Arrendar" },
//               { v: "sale",    l: "Venda" },
//             ].map(({ v, l }) => (
//               <button key={String(v)} onClick={() => set("listingType", v)}
//                 className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
//                 style={{
//                   background: filters.listingType === v ? "var(--brand)" : "var(--bg-surface)",
//                   color: filters.listingType === v ? "#fff" : "var(--text-muted)",
//                   border: `1.5px solid ${filters.listingType === v ? "var(--brand)" : "transparent"}`,
//                 }}>
//                 {l}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* City */}
//         <div>
//           <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Cidade</p>
//           <select value={filters.city ?? ""} onChange={e => set("city", e.target.value)} className="input-base text-sm">
//             <option value="">Todas</option>
//             {["Luanda","Benguela","Huambo","Lubango","Malanje","Namibe","Cabinda","Soyo"].map(c =>
//               <option key={c} value={c}>{c}</option>
//             )}
//           </select>
//         </div>

//         {/* Bedrooms */}
//         <div>
//           <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Quartos</p>
//           <div className="flex gap-1.5 flex-wrap">
//             {[undefined,1,2,3,4,5].map(n => (
//               <button key={String(n)} onClick={() => set("bedrooms", n)}
//                 className="min-w-[38px] h-9 px-2 rounded-xl text-xs font-semibold border transition-all"
//                 style={{
//                   background: filters.bedrooms === n ? "var(--text-primary)" : "transparent",
//                   color: filters.bedrooms === n ? "var(--bg-card)" : "var(--text-muted)",
//                   borderColor: filters.bedrooms === n ? "var(--text-primary)" : "var(--border-color)",
//                 }}>
//                 {n == null ? "∞" : `${n}+`}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Price */}
//         <div>
//           <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Preço (AOA)</p>
//           <div className="flex gap-2">
//             <input type="number" min={0} value={filters.minPrice ?? ""}
//               onChange={e => set("minPrice", e.target.value ? Number(e.target.value) : undefined)}
//               placeholder="Mín" className="input-base text-sm" />
//             <input type="number" min={0} value={filters.maxPrice ?? ""}
//               onChange={e => set("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
//               placeholder="Máx" className="input-base text-sm" />
//           </div>
//         </div>

//         {/* Sort */}
//         <div>
//           <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Ordenar</p>
//           <select value={filters.sortBy ?? "newest"} onChange={e => set("sortBy", e.target.value)} className="input-base text-sm">
//             <option value="newest">Mais recentes</option>
//             <option value="price_asc">Preço crescente</option>
//             <option value="price_desc">Preço decrescente</option>
//             <option value="most_viewed">Mais visualizados</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── HeroSection — uses dynamic DB slides ─────────────────────
// function HeroSection({ stats, locale, t, heroVisible, onSearch }: {
//   stats: Props["stats"];
//   locale: string;
//   t: ReturnType<typeof useI18n>["t"];
//   heroVisible: boolean;
//   onSearch: (search: string | undefined, listingType: string | undefined) => void;
// }) {
//   const { data: slides = [] } = useQuery<HeroSlide[]>({
//     queryKey: ["hero-slides"],
//     queryFn: async () => { const r = await fetch("/api/hero-slides"); return r.json(); },
//     staleTime: 60000,
//   });

//   const activeSlides = slides.filter(s => s.active);
//   const [slideIdx, setSlideIdx] = useState(0);
//   const slide: HeroSlide | undefined = activeSlides[slideIdx];

//   // Auto-advance slides
//   useEffect(() => {
//     if (activeSlides.length < 2) return;
//     const t = setInterval(() => setSlideIdx(i => (i + 1) % activeSlides.length), 6000);
//     return () => clearInterval(t);
//   }, [activeSlides.length]);

//   const [search, setSearch] = useState("");
//   const [listingType, setListingType] = useState("");

//   return (
//     <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
//       <style>{`
//         @keyframes float1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,10px) scale(0.97)}}
//         @keyframes float2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-25px,20px) scale(1.08)}}
//         @keyframes float3{0%,100%{transform:translate(0,0)}40%{transform:translate(20px,-30px)}70%{transform:translate(-15px,15px)}}
//         @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
//         .fade-up-1{animation:fadeUp 0.7s ease both}
//         .fade-up-2{animation:fadeUp 0.7s 0.15s ease both}
//         .fade-up-3{animation:fadeUp 0.7s 0.3s ease both}
//         .fade-up-4{animation:fadeUp 0.7s 0.45s ease both}
//         .fade-up-5{animation:fadeUp 0.7s 0.6s ease both}
//         @keyframes slideIn{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
//         .slide-img{animation:slideIn 0.8s ease both}
//       `}</style>

//       {/* Background image from slide (if set) */}
//       {slide?.showImage && slide.imageUrl && (
//         <div className="absolute inset-0 slide-img">
//           <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
//           <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,12,41,0.85) 0%, rgba(48,43,99,0.75) 50%, rgba(36,36,62,0.80) 100%)" }} />
//         </div>
//       )}

//       {/* Default gradient background */}
//       {(!slide?.showImage || !slide.imageUrl) && (
//         <>
//           <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)" }} />
//           <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
//             style={{ background: "radial-gradient(circle, #FF385C 0%, transparent 70%)", animation: "float1 8s ease-in-out infinite" }} />
//           <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-25 blur-3xl"
//             style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)", animation: "float2 10s ease-in-out infinite" }} />
//           <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-20 blur-3xl"
//             style={{ background: "radial-gradient(circle, #6C63FF 0%, transparent 70%)", animation: "float3 12s ease-in-out infinite" }} />
//           <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
//         </>
//       )}

//       {/* Content */}
//       <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
//         {/* Pill badge */}
//         <div className="fade-up-1 inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 text-xs font-semibold uppercase tracking-widest"
//           style={{ background: "rgba(255,56,92,0.18)", color: "#FF8FA3", border: "1px solid rgba(255,56,92,0.35)" }}>
//           <Sparkles className="w-3 h-3" />
//           {locale === "pt" ? "Plataforma nº1 de imóveis em Angola" : "Angola's #1 real estate platform"}
//         </div>

//         {/* Title — from slide or default */}
//         {(!slide || slide.showTitle) && (
//           <h1 className="fade-up-2 font-display font-bold text-white text-balance leading-[1.08] mb-6"
//             style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
//             {slide?.title ? (
//               <span dangerouslySetInnerHTML={{ __html: slide.title }} />
//             ) : (
//               locale === "pt"
//                 ? <>Encontre a sua<br /><span style={{ background:"linear-gradient(90deg,#FF385C,#C9A84C)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>casa dos sonhos</span></>
//                 : <>Find your<br /><span style={{ background:"linear-gradient(90deg,#FF385C,#C9A84C)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>dream home</span></>
//             )}
//           </h1>
//         )}

//         {/* Subtitle */}
//         {(!slide || slide.showSubtitle) && (
//           <p className="fade-up-3 text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
//             style={{ color: "rgba(255,255,255,0.65)" }}>
//             {slide?.subtitle || t.home.heroSub}
//           </p>
//         )}

//         {/* Search bar */}
//         <div className="fade-up-4 max-w-2xl mx-auto mb-6">
//           <div className="flex items-center rounded-2xl p-2 shadow-2xl"
//             style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)" }}>
//             <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 border-r" style={{ borderColor: "#E8E8E8" }}>
//               <MapPin className="w-4 h-4 shrink-0" style={{ color: "var(--brand)" }} />
//               <div className="flex flex-col">
//                 <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
//                   {locale === "pt" ? "Localização" : "Location"}
//                 </span>
//                 <input value={search} onChange={e => setSearch(e.target.value)}
//                   placeholder={locale === "pt" ? "Cidade ou zona…" : "City or area…"}
//                   className="bg-transparent text-sm font-medium outline-none w-full"
//                   style={{ color: "#222" }}
//                   onKeyDown={e => { if (e.key === "Enter") onSearch(search || undefined, listingType || undefined); }}
//                 />
//               </div>
//             </div>
//             <div className="hidden sm:flex flex-col px-4 py-2.5 border-r" style={{ borderColor: "#E8E8E8" }}>
//               <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
//                 {locale === "pt" ? "Tipo" : "Type"}
//               </span>
//               <select value={listingType} onChange={e => setListingType(e.target.value)}
//                 className="bg-transparent text-sm font-medium outline-none"
//                 style={{ color: "#222" }}>
//                 <option value="">{locale === "pt" ? "Qualquer" : "Any"}</option>
//                 <option value="rent">{t.home.forRent}</option>
//                 <option value="sale">{t.home.forSale}</option>
//               </select>
//             </div>
//             <button onClick={() => onSearch(search || undefined, listingType || undefined)}
//               className="ml-2 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shrink-0"
//               style={{ background: "linear-gradient(135deg, #FF385C, #E31C5F)" }}>
//               <Search className="w-4 h-4" />
//               <span className="hidden sm:inline">{locale === "pt" ? "Pesquisar" : "Search"}</span>
//             </button>
//           </div>
//         </div>

//         {/* Custom button from slide */}
//         {slide?.showButton && slide.buttonLabel && slide.buttonUrl && (
//           <div className="fade-up-4 mb-6">
//             <Link href={slide.buttonUrl}
//               className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white"
//               style={{ background: "linear-gradient(135deg, #FF385C, #E31C5F)", boxShadow: "0 4px 20px rgba(255,56,92,0.35)" }}>
//               {slide.buttonLabel} <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>
//         )}

//         {/* Stats chips */}
//         <div className="fade-up-5 flex flex-wrap justify-center gap-3">
//           {[
//             { icon: Building, value: `${stats.totalProperties}+`, label: locale==="pt"?"imóveis":"properties" },
//             { icon: MapPin,   value: `${stats.totalCities}`,      label: locale==="pt"?"cidades":"cities" },
//             { icon: Users,    value: `${stats.totalUsers}+`,      label: locale==="pt"?"utilizadores":"users" },
//             { icon: CheckCircle2, value: "98%",                   label: locale==="pt"?"satisfação":"satisfaction" },
//           ].map(({ icon: Icon, value, label }) => (
//             <div key={label} className="flex items-center gap-2 rounded-full px-4 py-2"
//               style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
//               <Icon className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.6)" }} />
//               <span className="text-sm font-bold text-white">{value}</span>
//               <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
//             </div>
//           ))}
//         </div>

//         {/* Slide nav dots */}
//         {activeSlides.length > 1 && (
//           <div className="flex items-center justify-center gap-2 mt-8">
//             <button onClick={() => setSlideIdx(i => (i - 1 + activeSlides.length) % activeSlides.length)}
//               className="w-8 h-8 rounded-full flex items-center justify-center"
//               style={{ background: "rgba(255,255,255,0.15)" }}>
//               <ChevronLeft className="w-4 h-4 text-white" />
//             </button>
//             {activeSlides.map((_, i) => (
//               <button key={i} onClick={() => setSlideIdx(i)}
//                 className="rounded-full transition-all"
//                 style={{ width: i === slideIdx ? 20 : 8, height: 8, background: i === slideIdx ? "#fff" : "rgba(255,255,255,0.4)" }} />
//             ))}
//             <button onClick={() => setSlideIdx(i => (i + 1) % activeSlides.length)}
//               className="w-8 h-8 rounded-full flex items-center justify-center"
//               style={{ background: "rgba(255,255,255,0.15)" }}>
//               <ChevronRightIcon className="w-4 h-4 text-white" />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Scroll indicator */}
//       <div className={cn("absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity duration-500", heroVisible ? "opacity-70" : "opacity-0")}>
//         <span className="text-xs text-white/50">{locale === "pt" ? "Explorar" : "Explore"}</span>
//         <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
//       </div>
//     </section>
//   );
// }

// // ── Main ─────────────────────────────────────────────────────
// export function HomeClient({ stats, initialFeatured }: Props) {
//   const { t, locale } = useI18n();
//   const propRef = useRef<HTMLDivElement>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>("grid");
//   const [mobileSidebar, setMobileSidebar] = useState(false);
//   const [activeCategory, setActiveCategory] = useState<string | undefined>();
//   const [heroVisible, setHeroVisible] = useState(true);

//   const [filters, setFilters] = useState<PropertyFilters>({ page: 1, pageSize: 8 });

//   const queryFilters = { ...filters, type: (activeCategory as never) ?? filters.type };
//   const { data, isLoading } = useProperties(viewMode === "map"
//     ? { ...queryFilters, pageSize: 50 }
//     : queryFilters
//   );

//   const properties = data?.data ?? [];

//   const scroll = () => propRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

//   // Track scroll to hide hero overlay
//   useEffect(() => {
//     const fn = () => setHeroVisible(window.scrollY < 100);
//     window.addEventListener("scroll", fn, { passive: true });
//     return () => window.removeEventListener("scroll", fn);
//   }, []);

//   const activeCount = Object.entries(filters).filter(
//     ([k, v]) => !["page","pageSize","sortBy"].includes(k) && v !== undefined && v !== ""
//   ).length + (activeCategory ? 1 : 0);

//   return (
//     <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
//       <Navbar />

//       {/* ╔══════════════════════════════════════════════════╗
//           ║  HERO  — dynamic slides from DB                  ║
//           ╚══════════════════════════════════════════════════╝ */}
//       <HeroSection
//         stats={stats}
//         locale={locale}
//         t={t}
//         heroVisible={heroVisible}
//         onSearch={(search, listingType) => { setFilters(p => ({ ...p, search, listingType, page: 1 })); scroll(); }}
//       />

//       {/* ╔══════════════════════════════════════════════════╗
//           ║  CATEGORY TABS                                   ║
//           ╚══════════════════════════════════════════════════╝ */}
//       <div className="sticky top-16 z-30 border-b"
//         style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderColor: "var(--border-color)" }}>
//         <div className="page-container">
//           <div className="flex items-center gap-1 overflow-x-auto py-3 no-scrollbar"
//             style={{ scrollbarWidth: "none" }}>
//             {CATEGORIES.map(({ icon: Icon, label, type }) => {
//               const active = activeCategory === type;
//               return (
//                 <button key={type}
//                   onClick={() => {
//                     setActiveCategory(active ? undefined : type);
//                     setFilters(p => ({ ...p, page: 1 }));
//                     scroll();
//                   }}
//                   className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl shrink-0 transition-all"
//                   style={{
//                     background: active ? "var(--brand)" : "transparent",
//                     color: active ? "#fff" : "var(--text-muted)",
//                   }}>
//                   <Icon className="w-4 h-4" />
//                   <span className="text-xs font-medium whitespace-nowrap">{label}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* ╔══════════════════════════════════════════════════╗
//           ║  PROPERTIES  — sidebar + grid/map               ║
//           ╚══════════════════════════════════════════════════╝ */}
//       <section ref={propRef} className="py-8 scroll-mt-32">
//         <div className="page-container">

//           {/* Toolbar */}
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-3">
//               <p className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
//                 {isLoading ? "A carregar…"
//                   : data ? `${data.total} ${data.total === 1 ? "imóvel" : "imóveis"}`
//                   : "Imóveis"}
//               </p>
//               {/* Mobile filter */}
//               <button onClick={() => setMobileSidebar(true)}
//                 className="md:hidden flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border transition-all"
//                 style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
//                 <SlidersHorizontal className="w-4 h-4" />
//                 Filtros
//                 {activeCount > 0 && (
//                   <span className="w-5 h-5 rounded-full text-[11px] font-bold text-white flex items-center justify-center"
//                     style={{ background: "var(--brand)" }}>{activeCount}</span>
//                 )}
//               </button>
//             </div>

//             {/* View toggle */}
//             <div className="flex items-center rounded-xl overflow-hidden border"
//               style={{ borderColor: "var(--border-color)" }}>
//               {([
//                 { mode: "grid" as ViewMode, Icon: LayoutGrid, label: "Grelha" },
//                 { mode: "map"  as ViewMode, Icon: Map,        label: "Mapa" },
//               ]).map(({ mode, Icon, label }) => (
//                 <button key={mode}
//                   onClick={() => {
//                     setViewMode(mode);
//                     setFilters(p => ({ ...p, page: 1 }));
//                   }}
//                   className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all"
//                   style={{
//                     background: viewMode === mode ? "var(--text-primary)" : "transparent",
//                     color: viewMode === mode ? "var(--bg-card)" : "var(--text-muted)",
//                   }}>
//                   <Icon className="w-4 h-4" />
//                   <span className="hidden sm:inline">{label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex gap-6">
//             {/* Sidebar desktop */}
//             <aside className="hidden md:block w-60 xl:w-64 shrink-0">
//               <div className="sticky top-36 rounded-2xl p-5 h-[calc(100vh-180px)] overflow-hidden flex flex-col"
//                 style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
//                 <SidebarFilters filters={filters} onChange={f => setFilters(f)} />
//               </div>
//             </aside>

//             {/* Content */}
//             <div className="flex-1 min-w-0">

//               {/* MAP VIEW — full width map only, no side card list */}
//               {viewMode === "map" && (
//                 <div className="rounded-3xl overflow-hidden"
//                   style={{ height: "calc(100vh - 240px)", minHeight: 500, border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
//                   <PropertyMap
//                     properties={properties}
//                     className="w-full h-full"
//                   />
//                 </div>
//               )}

//               {/* GRID VIEW */}
//               {viewMode === "grid" && (
//                 <>
//                   {isLoading ? (
//                     <PropertyGridSkeleton count={8} />
//                   ) : properties.length === 0 ? (
//                     <div className="text-center py-24 rounded-2xl"
//                       style={{ background: "var(--bg-surface)" }}>
//                       <p className="text-5xl mb-3">🏠</p>
//                       <p className="font-semibold text-lg mb-1" style={{ color: "var(--text-primary)" }}>Nenhum imóvel encontrado</p>
//                       <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Tente ajustar os filtros</p>
//                       <button onClick={() => { setFilters({ page:1, pageSize:8 }); setActiveCategory(undefined); }}
//                         className="btn-secondary text-sm">Limpar filtros</button>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
//                       {properties.map(p => <PropertyCard key={p.id} property={p} />)}
//                     </div>
//                   )}

//                   {data && (
//                     <Pagination
//                       page={filters.page ?? 1}
//                       totalPages={data.totalPages}
//                       total={data.total}
//                       pageSize={8}
//                       onPageChange={p => { setFilters(prev => ({ ...prev, page: p })); scroll(); }}
//                     />
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ╔══════════════════════════════════════════════════╗
//           ║  FEATURES  — 3 cards modernos                   ║
//           ╚══════════════════════════════════════════════════╝ */}
//       <section className="py-16 overflow-hidden"
//         style={{ background: "var(--bg-surface)" }}>
//         <div className="page-container">
//           <div className="text-center mb-12">
//             <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--brand)" }}>
//               {locale === "pt" ? "Porquê o Imovelo?" : "Why Imovelo?"}
//             </p>
//             <h2 className="font-display text-3xl md:text-4xl font-bold"
//               style={{ color: "var(--text-primary)" }}>
//               {locale === "pt" ? "A melhor forma de encontrar o seu imóvel" : "The best way to find your property"}
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[
//               {
//                 gradient: "linear-gradient(135deg, #FF385C 0%, #FF6B6B 100%)",
//                 icon: "🔍",
//                 title: locale === "pt" ? "Pesquisa inteligente" : "Smart search",
//                 desc:  locale === "pt" ? "Filtros avançados por localização, preço, tipologia e comodidades. Encontre exactamente o que procura." : "Advanced filters by location, price, type and amenities. Find exactly what you're looking for.",
//               },
//               {
//                 gradient: "linear-gradient(135deg, #C9A84C 0%, #F0C060 100%)",
//                 icon: "🗺️",
//                 title: locale === "pt" ? "Mapa interactivo" : "Interactive map",
//                 desc:  locale === "pt" ? "Veja todos os imóveis no mapa com locais de interesse próximos num raio de 5km: escolas, hospitais, praias e muito mais." : "See all properties on a map with nearby places of interest within 5km.",
//               },
//               {
//                 gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 icon: "🏠",
//                 title: locale === "pt" ? "Reserva simplificada" : "Simple booking",
//                 desc:  locale === "pt" ? "Contacte directamente o proprietário, faça o seu pedido de reserva e aguarde aprovação. Simples, rápido e seguro." : "Contact the owner directly, submit your booking request and await approval.",
//               },
//             ].map(({ gradient, icon, title, desc }) => (
//               <div key={title} className="relative p-7 rounded-2xl overflow-hidden group"
//                 style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)", transition: "box-shadow 0.25s, transform 0.25s" }}
//                 onMouseEnter={e => {
//                   const el = e.currentTarget as HTMLDivElement;
//                   el.style.boxShadow = "var(--shadow-hover)";
//                   el.style.transform = "translateY(-3px)";
//                 }}
//                 onMouseLeave={e => {
//                   const el = e.currentTarget as HTMLDivElement;
//                   el.style.boxShadow = "var(--shadow-sm)";
//                   el.style.transform = "none";
//                 }}>
//                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
//                   style={{ background: gradient }}>
//                   {icon}
//                 </div>
//                 <h3 className="font-display font-bold text-lg mb-3" style={{ color: "var(--text-primary)" }}>{title}</h3>
//                 <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ╔══════════════════════════════════════════════════╗
//           ║  CTA  — gradient bold                           ║
//           ╚══════════════════════════════════════════════════╝ */}
//       <section className="py-16">
//         <div className="page-container">
//           <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
//             style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 60%, #24243e 100%)" }}>
//             {/* Orb */}
//             <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-30"
//               style={{ background: "radial-gradient(circle, #FF385C, transparent 70%)", transform: "translate(30%, -30%)" }} />
//             <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
//               style={{ background: "radial-gradient(circle, #C9A84C, transparent 70%)", transform: "translate(-30%, 30%)" }} />

//             <div className="relative z-10">
//               <p className="text-xs font-bold uppercase tracking-widest mb-4"
//                 style={{ color: "rgba(255,56,92,0.9)" }}>
//                 {locale === "pt" ? "Para proprietários" : "For property owners"}
//               </p>
//               <h2 className="font-display font-bold text-white mb-4 text-balance"
//                 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
//                 {locale === "pt" ? "Publique o seu imóvel gratuitamente" : "List your property for free"}
//               </h2>
//               <p className="max-w-lg mx-auto mb-8 leading-relaxed"
//                 style={{ color: "rgba(255,255,255,0.6)" }}>
//                 {locale === "pt"
//                   ? "Registe-se como proprietário, publique o seu imóvel em minutos e comece a receber pedidos de reserva hoje mesmo."
//                   : "Sign up as an owner, list your property in minutes and start receiving booking requests today."}
//               </p>
//               <div className="flex gap-3 justify-center flex-wrap">
//                 <Link href="/register"
//                   className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
//                   style={{ background: "linear-gradient(135deg, #FF385C, #E31C5F)", color: "#fff" }}>
//                   {locale === "pt" ? "Começar agora" : "Get started"}
//                   <ArrowRight className="w-4 h-4" />
//                 </Link>
//                 <Link href="/properties"
//                   className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white/80 border border-white/20 transition-all hover:bg-white/10">
//                   {locale === "pt" ? "Explorar imóveis" : "Browse properties"}
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-8 border-t" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
//         <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
//           style={{ color: "var(--text-muted)" }}>
//           <div className="flex items-center gap-2">
//             <div className="w-7 h-7 rounded-lg flex items-center justify-center"
//               style={{ background: "linear-gradient(135deg, #FF385C, #E31C5F)" }}>
//               <Building className="w-3.5 h-3.5 text-white" />
//             </div>
//             <span className="font-display font-bold text-base" style={{ color: "var(--brand)" }}>imo</span>
//             <span className="font-display text-base" style={{ color: "var(--text-primary)" }}>velo</span>
//           </div>
//           <p>© {new Date().getFullYear()} Imovelo. {locale === "pt" ? "Todos os direitos reservados." : "All rights reserved."}</p>
//         </div>
//       </footer>

//       {/* Mobile sidebar */}
//       {mobileSidebar && (
//         <div className="fixed inset-0 z-50 flex md:hidden">
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={() => setMobileSidebar(false)} />
//           <div className="relative z-10 w-80 h-full p-5"
//             style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border-color)" }}>
//             <SidebarFilters
//               filters={filters}
//               onChange={f => { setFilters(f); }}
//               onClose={() => setMobileSidebar(false)}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useI18n, formatPrice } from "@/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Pagination } from "@/components/shared/Pagination";
import { PropertyGridSkeleton } from "@/components/shared/Skeleton";
import { useProperties } from "@/hooks/useProperties";
import {
  Search, Map, LayoutGrid, ArrowRight, ChevronDown,
  Home, Building, TreePine, Waves, Star, Sparkles,
  SlidersHorizontal, X, MapPin, Users, CheckCircle2, ChevronLeft, ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import type { Property, PropertyFilters, ListingType } from "@/types";
import type { HeroSlide } from "@/lib/db/schema";

const PropertyMap = dynamic(
  () => import("@/components/map/PropertyMap").then((m) => m.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full rounded-3xl animate-pulse"
        style={{ background: "var(--bg-surface)" }} />
    ),
  }
);

type ViewMode = "grid" | "map";

interface Props {
  stats: { totalProperties: number; totalUsers: number; totalCities: number };
  initialFeatured: Property[];
}

// ── Category tabs ────────────────────────────────────────────
const CATEGORIES = [
  { icon: Home,     label: "Apartamentos", type: "apartment" },
  { icon: Building, label: "Moradias",     type: "house" },
  { icon: Star,     label: "Villas",       type: "villa" },
  { icon: Sparkles, label: "Coberturas",   type: "penthouse" },
  { icon: TreePine, label: "Terrenos",     type: "land" },
  { icon: Waves,    label: "Studios",      type: "studio" },
];

// ── Sidebar filters ───────────────────────────────────────────
function SidebarFilters({ filters, onChange, onClose }: {
  filters: PropertyFilters;
  onChange: (f: PropertyFilters) => void;
  onClose?: () => void;
}) {
  const set = (k: keyof PropertyFilters, v: unknown) =>
    onChange({ ...filters, [k]: v || undefined, page: 1 });

  const activeCount = Object.entries(filters).filter(
    ([k, v]) => !["page","pageSize","sortBy"].includes(k) && v !== undefined && v !== ""
  ).length;

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Filtros</p>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button onClick={() => onChange({ page: 1, pageSize: filters.pageSize ?? 8 })}
              className="text-xs font-semibold" style={{ color: "var(--brand)" }}>
              Limpar ({activeCount})
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--bg-surface)" }}>
              <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-0.5">
        {/* Listing type */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Negócio</p>
          <div className="flex gap-2">
            {[
              { v: undefined,  l: "Todos" },
              { v: "rent" as ListingType, l: "Arrendar" },
              { v: "sale" as ListingType, l: "Venda" },
            ].map(({ v, l }) => (
              <button key={String(v)} onClick={() => set("listingType", v)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: filters.listingType === v ? "var(--brand)" : "var(--bg-surface)",
                  color: filters.listingType === v ? "#fff" : "var(--text-muted)",
                  border: `1.5px solid ${filters.listingType === v ? "var(--brand)" : "transparent"}`,
                }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* City */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Cidade</p>
          <select value={filters.city ?? ""} onChange={e => set("city", e.target.value)} className="input-base text-sm">
            <option value="">Todas</option>
            {["Luanda","Benguela","Huambo","Lubango","Malanje","Namibe","Cabinda","Soyo"].map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Quartos</p>
          <div className="flex gap-1.5 flex-wrap">
            {[undefined,1,2,3,4,5].map(n => (
              <button key={String(n)} onClick={() => set("bedrooms", n)}
                className="min-w-[38px] h-9 px-2 rounded-xl text-xs font-semibold border transition-all"
                style={{
                  background: filters.bedrooms === n ? "var(--text-primary)" : "transparent",
                  color: filters.bedrooms === n ? "var(--bg-card)" : "var(--text-muted)",
                  borderColor: filters.bedrooms === n ? "var(--text-primary)" : "var(--border-color)",
                }}>
                {n == null ? "∞" : `${n}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Preço (AOA)</p>
          <div className="flex gap-2">
            <input type="number" min={0} value={filters.minPrice ?? ""}
              onChange={e => set("minPrice", e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Mín" className="input-base text-sm" />
            <input type="number" min={0} value={filters.maxPrice ?? ""}
              onChange={e => set("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Máx" className="input-base text-sm" />
          </div>
        </div>

        {/* Sort */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Ordenar</p>
          <select value={filters.sortBy ?? "newest"} onChange={e => set("sortBy", e.target.value)} className="input-base text-sm">
            <option value="newest">Mais recentes</option>
            <option value="price_asc">Preço crescente</option>
            <option value="price_desc">Preço decrescente</option>
            <option value="most_viewed">Mais visualizados</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ── HeroSection ──────────────────────────────────────────────
function HeroSection({ stats, locale, t, heroVisible, onSearch }: {
  stats: Props["stats"];
  locale: string;
  t: ReturnType<typeof useI18n>["t"];
  heroVisible: boolean;
  onSearch: (search: string | undefined, listingType: ListingType | undefined) => void;
}) {
  const { data: slides = [] } = useQuery<HeroSlide[]>({
    queryKey: ["hero-slides"],
    queryFn: async () => { const r = await fetch("/api/hero-slides"); return r.json(); },
    staleTime: 60000,
  });

  const activeSlides = slides.filter(s => s.active);
  const [slideIdx, setSlideIdx] = useState(0);
  const slide: HeroSlide | undefined = activeSlides[slideIdx];

  useEffect(() => {
    if (activeSlides.length < 2) return;
    const timer = setInterval(() => setSlideIdx(i => (i + 1) % activeSlides.length), 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState<ListingType | "">("");

  const handleSearch = () => {
    onSearch(
      search || undefined,
      (listingType as ListingType) || undefined,
    );
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
      <style>{`
        @keyframes float1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,10px) scale(0.97)}}
        @keyframes float2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-25px,20px) scale(1.08)}}
        @keyframes float3{0%,100%{transform:translate(0,0)}40%{transform:translate(20px,-30px)}70%{transform:translate(-15px,15px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .fade-up-1{animation:fadeUp 0.7s ease both}
        .fade-up-2{animation:fadeUp 0.7s 0.15s ease both}
        .fade-up-3{animation:fadeUp 0.7s 0.3s ease both}
        .fade-up-4{animation:fadeUp 0.7s 0.45s ease both}
        .fade-up-5{animation:fadeUp 0.7s 0.6s ease both}
        @keyframes slideIn{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
        .slide-img{animation:slideIn 0.8s ease both}
      `}</style>

      {/* Background image from slide */}
      {slide?.showImage && slide.imageUrl && (
        <div className="absolute inset-0 slide-img">
          <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,12,41,0.85) 0%, rgba(48,43,99,0.75) 50%, rgba(36,36,62,0.80) 100%)" }} />
        </div>
      )}

      {/* Default gradient background */}
      {(!slide?.showImage || !slide.imageUrl) && (
        <>
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)" }} />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, #FF385C 0%, transparent 70%)", animation: "float1 8s ease-in-out infinite" }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)", animation: "float2 10s ease-in-out infinite" }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #6C63FF 0%, transparent 70%)", animation: "float3 12s ease-in-out infinite" }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
        <div className="fade-up-1 inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 text-xs font-semibold uppercase tracking-widest"
          style={{ background: "rgba(255,56,92,0.18)", color: "#FF8FA3", border: "1px solid rgba(255,56,92,0.35)" }}>
          <Sparkles className="w-3 h-3" />
          {locale === "pt" ? "Plataforma nº1 de imóveis em Angola" : "Angola's #1 real estate platform"}
        </div>

        {(!slide || slide.showTitle) && (
          <h1 className="fade-up-2 font-display font-bold text-white text-balance leading-[1.08] mb-6"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
            {slide?.title ? (
              <span dangerouslySetInnerHTML={{ __html: slide.title }} />
            ) : (
              locale === "pt"
                ? <>Encontre a sua<br /><span style={{ background:"linear-gradient(90deg,#FF385C,#C9A84C)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>casa dos sonhos</span></>
                : <>Find your<br /><span style={{ background:"linear-gradient(90deg,#FF385C,#C9A84C)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>dream home</span></>
            )}
          </h1>
        )}

        {(!slide || slide.showSubtitle) && (
          <p className="fade-up-3 text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.65)" }}>
            {slide?.subtitle || t.home.heroSub}
          </p>
        )}

        {/* Search bar */}
        <div className="fade-up-4 max-w-2xl mx-auto mb-6">
          <div className="flex items-center rounded-2xl p-2 shadow-2xl"
            style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)" }}>
            <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 border-r" style={{ borderColor: "#E8E8E8" }}>
              <MapPin className="w-4 h-4 shrink-0" style={{ color: "var(--brand)" }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  {locale === "pt" ? "Localização" : "Location"}
                </span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={locale === "pt" ? "Cidade ou zona…" : "City or area…"}
                  className="bg-transparent text-sm font-medium outline-none w-full"
                  style={{ color: "#222" }}
                  onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
                />
              </div>
            </div>
            <div className="hidden sm:flex flex-col px-4 py-2.5 border-r" style={{ borderColor: "#E8E8E8" }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                {locale === "pt" ? "Tipo" : "Type"}
              </span>
              <select
                value={listingType}
                onChange={e => setListingType(e.target.value as ListingType | "")}
                className="bg-transparent text-sm font-medium outline-none"
                style={{ color: "#222" }}>
                <option value="">{locale === "pt" ? "Qualquer" : "Any"}</option>
                <option value="rent">{t.home.forRent}</option>
                <option value="sale">{t.home.forSale}</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="ml-2 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #FF385C, #E31C5F)" }}>
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">{locale === "pt" ? "Pesquisar" : "Search"}</span>
            </button>
          </div>
        </div>

        {slide?.showButton && slide.buttonLabel && slide.buttonUrl && (
          <div className="fade-up-4 mb-6">
            <Link href={slide.buttonUrl}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #FF385C, #E31C5F)", boxShadow: "0 4px 20px rgba(255,56,92,0.35)" }}>
              {slide.buttonLabel} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Stats chips */}
        <div className="fade-up-5 flex flex-wrap justify-center gap-3">
          {[
            { icon: Building,     value: `${stats.totalProperties}+`, label: locale==="pt"?"imóveis":"properties" },
            { icon: MapPin,       value: `${stats.totalCities}`,      label: locale==="pt"?"cidades":"cities" },
            { icon: Users,        value: `${stats.totalUsers}+`,      label: locale==="pt"?"utilizadores":"users" },
            { icon: CheckCircle2, value: "98%",                       label: locale==="pt"?"satisfação":"satisfaction" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-full px-4 py-2"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
              <Icon className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.6)" }} />
              <span className="text-sm font-bold text-white">{value}</span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Slide nav dots */}
        {activeSlides.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => setSlideIdx(i => (i - 1 + activeSlides.length) % activeSlides.length)}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            {activeSlides.map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)}
                className="rounded-full transition-all"
                style={{ width: i === slideIdx ? 20 : 8, height: 8, background: i === slideIdx ? "#fff" : "rgba(255,255,255,0.4)" }} />
            ))}
            <button onClick={() => setSlideIdx(i => (i + 1) % activeSlides.length)}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <ChevronRightIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className={cn("absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity duration-500", heroVisible ? "opacity-70" : "opacity-0")}>
        <span className="text-xs text-white/50">{locale === "pt" ? "Explorar" : "Explore"}</span>
        <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
      </div>
    </section>
  );
}

// ── Main ─────────────────────────────────────────────────────
export function HomeClient({ stats, initialFeatured }: Props) {
  const { t, locale } = useI18n();
  const propRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [heroVisible, setHeroVisible] = useState(true);

  const [filters, setFilters] = useState<PropertyFilters>({ page: 1, pageSize: 8 });

  const queryFilters = { ...filters, type: (activeCategory as never) ?? filters.type };
  const { data, isLoading } = useProperties(viewMode === "map"
    ? { ...queryFilters, pageSize: 50 }
    : queryFilters
  );

  const properties = data?.data ?? [];

  const scroll = () => propRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  useEffect(() => {
    const fn = () => setHeroVisible(window.scrollY < 100);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const activeCount = Object.entries(filters).filter(
    ([k, v]) => !["page","pageSize","sortBy"].includes(k) && v !== undefined && v !== ""
  ).length + (activeCategory ? 1 : 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Navbar />

      <HeroSection
        stats={stats}
        locale={locale}
        t={t}
        heroVisible={heroVisible}
        onSearch={(search, listingType) => {
          setFilters(p => ({ ...p, search, listingType, page: 1 }));
          scroll();
        }}
      />

      {/* Category tabs */}
      <div className="sticky top-16 z-30 border-b"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderColor: "var(--border-color)" }}>
        <div className="page-container">
          <div className="flex items-center gap-1 overflow-x-auto py-3 no-scrollbar"
            style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map(({ icon: Icon, label, type }) => {
              const active = activeCategory === type;
              return (
                <button key={type}
                  onClick={() => {
                    setActiveCategory(active ? undefined : type);
                    setFilters(p => ({ ...p, page: 1 }));
                    scroll();
                  }}
                  className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl shrink-0 transition-all"
                  style={{
                    background: active ? "var(--brand)" : "transparent",
                    color: active ? "#fff" : "var(--text-muted)",
                  }}>
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium whitespace-nowrap">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Properties section */}
      <section ref={propRef} className="py-8 scroll-mt-32">
        <div className="page-container">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <p className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
                {isLoading ? "A carregar…"
                  : data ? `${data.total} ${data.total === 1 ? "imóvel" : "imóveis"}`
                  : "Imóveis"}
              </p>
              <button onClick={() => setMobileSidebar(true)}
                className="md:hidden flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border transition-all"
                style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {activeCount > 0 && (
                  <span className="w-5 h-5 rounded-full text-[11px] font-bold text-white flex items-center justify-center"
                    style={{ background: "var(--brand)" }}>{activeCount}</span>
                )}
              </button>
            </div>

            <div className="flex items-center rounded-xl overflow-hidden border"
              style={{ borderColor: "var(--border-color)" }}>
              {([
                { mode: "grid" as ViewMode, Icon: LayoutGrid, label: "Grelha" },
                { mode: "map"  as ViewMode, Icon: Map,        label: "Mapa" },
              ]).map(({ mode, Icon, label }) => (
                <button key={mode}
                  onClick={() => { setViewMode(mode); setFilters(p => ({ ...p, page: 1 })); }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all"
                  style={{
                    background: viewMode === mode ? "var(--text-primary)" : "transparent",
                    color: viewMode === mode ? "var(--bg-card)" : "var(--text-muted)",
                  }}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            {/* Sidebar desktop */}
            <aside className="hidden md:block w-60 xl:w-64 shrink-0">
              <div className="sticky top-36 rounded-2xl p-5 h-[calc(100vh-180px)] overflow-hidden flex flex-col"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
                <SidebarFilters filters={filters} onChange={f => setFilters(f)} />
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {viewMode === "map" && (
                <div className="rounded-3xl overflow-hidden"
                  style={{ height: "calc(100vh - 240px)", minHeight: 500, border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
                  <PropertyMap properties={properties} className="w-full h-full" />
                </div>
              )}

              {viewMode === "grid" && (
                <>
                  {isLoading ? (
                    <PropertyGridSkeleton count={8} />
                  ) : properties.length === 0 ? (
                    <div className="text-center py-24 rounded-2xl" style={{ background: "var(--bg-surface)" }}>
                      <p className="text-5xl mb-3">🏠</p>
                      <p className="font-semibold text-lg mb-1" style={{ color: "var(--text-primary)" }}>Nenhum imóvel encontrado</p>
                      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Tente ajustar os filtros</p>
                      <button onClick={() => { setFilters({ page:1, pageSize:8 }); setActiveCategory(undefined); }}
                        className="btn-secondary text-sm">Limpar filtros</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
                      {properties.map(p => <PropertyCard key={p.id} property={p} />)}
                    </div>
                  )}

                  {data && (
                    <Pagination
                      page={filters.page ?? 1}
                      totalPages={data.totalPages}
                      total={data.total}
                      pageSize={8}
                      onPageChange={p => { setFilters(prev => ({ ...prev, page: p })); scroll(); }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 overflow-hidden" style={{ background: "var(--bg-surface)" }}>
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--brand)" }}>
              {locale === "pt" ? "Porquê o Imovelo?" : "Why Imovelo?"}
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
              {locale === "pt" ? "A melhor forma de encontrar o seu imóvel" : "The best way to find your property"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                gradient: "linear-gradient(135deg, #FF385C 0%, #FF6B6B 100%)",
                icon: "🔍",
                title: locale === "pt" ? "Pesquisa inteligente" : "Smart search",
                desc:  locale === "pt" ? "Filtros avançados por localização, preço, tipologia e comodidades. Encontre exactamente o que procura." : "Advanced filters by location, price, type and amenities. Find exactly what you're looking for.",
              },
              {
                gradient: "linear-gradient(135deg, #C9A84C 0%, #F0C060 100%)",
                icon: "🗺️",
                title: locale === "pt" ? "Mapa interactivo" : "Interactive map",
                desc:  locale === "pt" ? "Veja todos os imóveis no mapa com locais de interesse próximos num raio de 5km: escolas, hospitais, praias e muito mais." : "See all properties on a map with nearby places of interest within 5km.",
              },
              {
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                icon: "🏠",
                title: locale === "pt" ? "Reserva simplificada" : "Simple booking",
                desc:  locale === "pt" ? "Contacte directamente o proprietário, faça o seu pedido de reserva e aguarde aprovação. Simples, rápido e seguro." : "Contact the owner directly, submit your booking request and await approval.",
              },
            ].map(({ gradient, icon, title, desc }) => (
              <div key={title} className="relative p-7 rounded-2xl overflow-hidden group"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)", transition: "box-shadow 0.25s, transform 0.25s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "var(--shadow-hover)"; el.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "var(--shadow-sm)"; el.style.transform = "none"; }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: gradient }}>
                  {icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-3" style={{ color: "var(--text-primary)" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="page-container">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
            style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 60%, #24243e 100%)" }}>
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-30"
              style={{ background: "radial-gradient(circle, #FF385C, transparent 70%)", transform: "translate(30%, -30%)" }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{ background: "radial-gradient(circle, #C9A84C, transparent 70%)", transform: "translate(-30%, 30%)" }} />

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,56,92,0.9)" }}>
                {locale === "pt" ? "Para proprietários" : "For property owners"}
              </p>
              <h2 className="font-display font-bold text-white mb-4 text-balance"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
                {locale === "pt" ? "Publique o seu imóvel gratuitamente" : "List your property for free"}
              </h2>
              <p className="max-w-lg mx-auto mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                {locale === "pt"
                  ? "Registe-se como proprietário, publique o seu imóvel em minutos e comece a receber pedidos de reserva hoje mesmo."
                  : "Sign up as an owner, list your property in minutes and start receiving booking requests today."}
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/register"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #FF385C, #E31C5F)", color: "#fff" }}>
                  {locale === "pt" ? "Começar agora" : "Get started"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/properties"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white/80 border border-white/20 transition-all hover:bg-white/10">
                  {locale === "pt" ? "Explorar imóveis" : "Browse properties"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          style={{ color: "var(--text-muted)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #FF385C, #E31C5F)" }}>
              <Building className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-base" style={{ color: "var(--brand)" }}>imo</span>
            <span className="font-display text-base" style={{ color: "var(--text-primary)" }}>velo</span>
          </div>
          <p>© {new Date().getFullYear()} Imovelo. {locale === "pt" ? "Todos os direitos reservados." : "All rights reserved."}</p>
        </div>
      </footer>

      {/* Mobile sidebar */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} />
          <div className="relative z-10 w-80 h-full p-5"
            style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border-color)" }}>
            <SidebarFilters
              filters={filters}
              onChange={f => setFilters(f)}
              onClose={() => setMobileSidebar(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}