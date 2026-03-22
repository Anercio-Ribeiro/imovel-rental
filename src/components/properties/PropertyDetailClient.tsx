// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { useI18n, formatPrice, formatDistance } from "@/i18n";
// import { useNearbyPlaces, useToggleFavorite } from "@/hooks/useProperties";
// import { BookingModal } from "./BookingModal";
// import { Navbar } from "@/components/layout/Navbar";
// import { toast } from "sonner";
// import dynamic from "next/dynamic";
// import {
//   BedDouble, Bath, Maximize2, Car, MapPin, Phone, Mail,
//   Heart, Share2, ArrowLeft, Calendar, Star, CheckCircle2,
//   ChevronLeft, ChevronRight, Waves, Trees, GraduationCap,
//   Hospital, ShoppingCart, Bus, Dumbbell, Pill, Landmark,
//   Utensils, Navigation, X,
// } from "lucide-react";
// import { cn, formatDate, getInitials } from "@/lib/utils";
// import type { Property, NearbyPlace, NearbyPlaceType } from "@/types";

// const PropertyMap = dynamic(
//   () => import("@/components/map/PropertyMap").then((m) => m.PropertyMap),
//   { ssr: false }
// );

// // Inline map that shows property + one selected nearby place with a route line
// const SinglePlaceMap = dynamic(
//   () => import("@/components/map/NearbyPlacesMap").then((m) => m.NearbyPlacesMap),
//   { ssr: false }
// );

// const NEARBY_ICONS: Record<NearbyPlaceType, React.ElementType> = {
//   school: GraduationCap, hospital: Hospital, supermarket: ShoppingCart,
//   beach: Waves, restaurant: Utensils, park: Trees, pharmacy: Pill,
//   bank: Landmark, transport: Bus, gym: Dumbbell,
// };

// const NEARBY_COLORS: Record<NearbyPlaceType, string> = {
//   school:"#4A8FD4", hospital:"#E05C5C", supermarket:"#4CAF7D", beach:"#00BCD4",
//   restaurant:"#FF9800", park:"#8BC34A", pharmacy:"#9C27B0", bank:"#C9A84C",
//   transport:"#607D8B", gym:"#FF5722",
// };

// interface Props {
//   property: Property & { owner?: { id:string;name:string;email:string;phone?:string;avatar?:string;createdAt:string }|null };
// }

// // ── NearbyPlacesList: grid of cards, click to show individual mini-map ─────
// function NearbyPlacesList({ places, propertyLat, propertyLng, locale }: {
//   places: NearbyPlace[];
//   propertyLat: number;
//   propertyLng: number;
//   locale: string;
// }) {
//   const [selected, setSelected] = useState<NearbyPlace | null>(null);

//   const toggle = (p: NearbyPlace) => setSelected(prev => prev?.id === p.id ? null : p);

//   return (
//     <div className="flex flex-col gap-3">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//         {places.slice(0, 12).map((place) => {
//           const Icon  = NEARBY_ICONS[place.type] ?? MapPin;
//           const color = NEARBY_COLORS[place.type] ?? "#888";
//           const isOpen = selected?.id === place.id;
//           const LABELS: Record<NearbyPlaceType, string> = {
//             school:"Escola", hospital:"Hospital", supermarket:"Supermercado",
//             beach:"Praia", restaurant:"Restaurante", park:"Parque",
//             pharmacy:"Farmácia", bank:"Banco", transport:"Transporte", gym:"Ginásio",
//           };
//           return (
//             <button
//               key={place.id}
//               onClick={() => toggle(place)}
//               className="flex items-center gap-3 p-3 rounded-xl text-sm text-left transition-all w-full"
//               style={{
//                 background: isOpen ? `${color}14` : "var(--bg-card)",
//                 border: `1px solid ${isOpen ? color : "var(--border-color)"}`,
//               }}>
//               <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
//                 style={{ background: `${color}18` }}>
//                 <Icon className="w-4 h-4" style={{ color }} />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-medium truncate" style={{ color: "var(--text-primary)" }}>{place.name}</p>
//                 <p className="text-xs" style={{ color: "var(--text-muted)" }}>{LABELS[place.type] ?? place.type}</p>
//               </div>
//               <div className="flex flex-col items-end gap-1 shrink-0">
//                 <span className="text-xs font-semibold" style={{ color }}>
//                   {formatDistance(place.distance, locale as "pt"|"en")}
//                 </span>
//                 <Navigation className="w-3 h-3" style={{ color: isOpen ? color : "var(--text-subtle)", opacity: 0.7 }} />
//               </div>
//             </button>
//           );
//         })}
//       </div>

//       {/* Individual place mini-map */}
//       {selected && (
//         <div className="rounded-2xl overflow-hidden relative" style={{ border: "1px solid var(--border-color)" }}>
//           <div className="absolute top-3 right-3 z-10">
//             <button onClick={() => setSelected(null)}
//               className="w-8 h-8 rounded-full flex items-center justify-center"
//               style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
//               <X className="w-4 h-4" style={{ color: "#222" }} />
//             </button>
//           </div>
//           <div className="px-3 py-2 flex items-center gap-2 border-b"
//             style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
//             {(() => {
//               const Icon = NEARBY_ICONS[selected.type] ?? MapPin;
//               const color = NEARBY_COLORS[selected.type] ?? "#888";
//               return (
//                 <>
//                   <Icon className="w-4 h-4" style={{ color }} />
//                   <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{selected.name}</span>
//                   <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>
//                     {formatDistance(selected.distance, locale as "pt"|"en")} · clique no mapa para abrir direcções
//                   </span>
//                 </>
//               );
//             })()}
//           </div>
//           <SinglePlaceMap
//             propertyLat={propertyLat}
//             propertyLng={propertyLng}
//             places={[selected]}
//             className="h-64 w-full"
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Main component ────────────────────────────────────────────
// export function PropertyDetailClient({ property }: Props) {
//   const { data: session } = useSession();
//   const { t, locale } = useI18n();
//   const toggleFavorite = useToggleFavorite();
//   const { data: nearbyPlaces = [] } = useNearbyPlaces(property.id);

//   const [currentImage, setCurrentImage] = useState(0);
//   const [bookingOpen, setBookingOpen] = useState(false);

//   const images = Array.isArray(property.images) ? property.images : [];
//   const title = locale === "en" && property.titleEn ? property.titleEn : property.title;
//   const description = locale === "en" && property.descriptionEn ? property.descriptionEn : property.description;

//   const canBook    = session?.user?.role === "tenant";
//   const canFavorite = session?.user?.role === "tenant";

//   const handleFavorite = async () => {
//     if (!session?.user) { toast.error(t.property.loginToFavorite); return; }
//     if (!canFavorite) return;
//     try {
//       const res = await toggleFavorite.mutateAsync(property.id);
//       toast.success(res.favorited ? "Adicionado aos favoritos ♥" : "Removido dos favoritos");
//     } catch { toast.error(t.common.error); }
//   };

//   const handleShare = () => {
//     navigator.clipboard?.writeText(window.location.href);
//     toast.success("Link copiado!");
//   };

//   const amenities = [
//     { label: t.property.amenities.furnished,  active: property.furnished },
//     { label: t.property.amenities.petFriendly, active: property.petFriendly },
//     { label: t.property.amenities.hasPool,    active: property.hasPool },
//     { label: t.property.amenities.hasGarden,  active: property.hasGarden },
//     { label: t.property.amenities.hasGym,     active: property.hasGym },
//     { label: t.property.amenities.hasSecurity,active: property.hasSecurity },
//     { label: t.property.amenities.hasElevator,active: property.hasElevator },
//   ].filter(a => a.active);

//   const card = (children: React.ReactNode, extra?: string) => (
//     <div className={`rounded-2xl p-5 ${extra ?? ""}`}
//       style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
//       {children}
//     </div>
//   );

//   const sectionTitle = (text: string) => (
//     <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3"
//       style={{ color: "var(--brand)" }}>{text}</h2>
//   );

//   return (
//     <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
//       <Navbar />
//       <main className="pt-16">

//         {/* Breadcrumb */}
//         <div className="page-container py-4">
//           <Link href="/properties" className="flex items-center gap-1.5 text-sm transition-colors"
//             style={{ color: "var(--text-muted)" }}
//             onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
//             onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
//             <ArrowLeft className="w-4 h-4" /> {t.nav.properties}
//           </Link>
//         </div>

//         {/* ── GALLERY ── */}
//         <div className="page-container mb-8">
//           <div className="relative rounded-2xl overflow-hidden group"
//             style={{ height: "60vh", minHeight: 320, background: "var(--bg-surface)" }}>

//             {images.length > 0 ? (
//               <>
//                 {/* Main image — unoptimized keeps full resolution from external URLs */}
//                 <Image
//                   src={images[currentImage]}
//                   alt={`${title} — foto ${currentImage + 1}`}
//                   fill
//                   priority
//                   unoptimized
//                   style={{ objectFit: "cover", objectPosition: "center" }}
//                 />

//                 {/* Nav arrows */}
//                 {images.length > 1 && (
//                   <>
//                     <button onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)}
//                       className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
//                       style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 2px 10px rgba(0,0,0,0.20)" }}>
//                       <ChevronLeft className="w-5 h-5" style={{ color: "#222" }} />
//                     </button>
//                     <button onClick={() => setCurrentImage(i => (i + 1) % images.length)}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
//                       style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 2px 10px rgba(0,0,0,0.20)" }}>
//                       <ChevronRight className="w-5 h-5" style={{ color: "#222" }} />
//                     </button>
//                     {/* Dot indicators */}
//                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
//                       {images.map((_, i) => (
//                         <button key={i} onClick={() => setCurrentImage(i)}
//                           className="rounded-full transition-all"
//                           style={{
//                             width: i === currentImage ? 20 : 8, height: 8,
//                             background: i === currentImage ? "#fff" : "rgba(255,255,255,0.5)",
//                           }} />
//                       ))}
//                     </div>
//                   </>
//                 )}

//                 {/* Thumbnails */}
//                 {images.length > 1 && (
//                   <div className="absolute bottom-4 right-4 flex gap-2">
//                     {images.slice(0, 5).map((img, i) => (
//                       <button key={i} onClick={() => setCurrentImage(i)}
//                         className="w-14 h-14 rounded-xl overflow-hidden transition-all"
//                         style={{
//                           outline: i === currentImage ? "2.5px solid #fff" : "none",
//                           outlineOffset: 2,
//                           opacity: i === currentImage ? 1 : 0.62,
//                         }}>
//                         <img src={img} alt="" className="w-full h-full object-cover" loading="eager" />
//                       </button>
//                     ))}
//                     {images.length > 5 && (
//                       <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xs font-bold text-white"
//                         style={{ background: "rgba(0,0,0,0.55)" }}>
//                         +{images.length - 5}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-6xl">🏠</div>
//             )}

//             {/* Badges — same style as card */}
//             <div className="absolute top-4 left-4 flex gap-2">
//               <span className={cn("badge shadow-sm", property.listingType === "rent" ? "badge-rent" : "badge-sale")}>
//                 {property.listingType === "rent" ? t.home.forRent : t.home.forSale}
//               </span>
//               <span className="badge shadow-sm"
//                 style={{ background: "rgba(255,255,255,0.92)", color: "#222", border: "none" }}>
//                 {t.property.type[property.type]}
//               </span>
//             </div>

//             {/* Action buttons */}
//             <div className="absolute top-4 right-4 flex gap-2">
//               {canFavorite && (
//                 <button onClick={handleFavorite}
//                   className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
//                   style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 1px 6px rgba(0,0,0,0.20)" }}>
//                   <Heart className="w-5 h-5" style={{
//                     stroke: property.isFavorited ? "#FF385C" : "#222",
//                     fill: property.isFavorited ? "#FF385C" : "none",
//                     strokeWidth: 2,
//                   }} />
//                 </button>
//               )}
//               <button onClick={handleShare}
//                 className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
//                 style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 1px 6px rgba(0,0,0,0.20)" }}>
//                 <Share2 className="w-5 h-5" style={{ color: "#222" }} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ── BODY ── */}
//         <div className="page-container pb-16">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//             {/* ── LEFT ── */}
//             <div className="lg:col-span-2 flex flex-col gap-6">

//               {/* Title + price */}
//               <div>
//                 <p className="font-display text-4xl font-bold text-gold-500 mb-1">
//                   {formatPrice(property.price, locale)}
//                   {property.priceUnit === "month" && (
//                     <span className="text-base font-sans font-normal ml-2" style={{ color: "var(--text-muted)" }}>
//                       {t.common.perMonth}
//                     </span>
//                   )}
//                 </p>
//                 <h1 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{title}</h1>
//                 <p className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
//                   <MapPin className="w-4 h-4 shrink-0 text-gold-500" />
//                   {property.address}, {property.city}, {property.province}
//                 </p>
//               </div>

//               {/* Key stats */}
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                 {[
//                   { Icon: BedDouble, value: property.bedrooms, label: t.property.bedrooms },
//                   { Icon: Bath,      value: property.bathrooms, label: "WC" },
//                   { Icon: Maximize2, value: `${property.area}m²`, label: t.property.area },
//                   { Icon: Car,       value: property.parkingSpots, label: t.property.parking },
//                 ].map(({ Icon, value, label }) => card(
//                   <div className="text-center">
//                     <Icon className="w-5 h-5 text-gold-500 mx-auto mb-2" />
//                     <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
//                     <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Description */}
//               {card(<>
//                 {sectionTitle(t.property.description)}
//                 <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{description}</p>
//               </>)}

//               {/* Details */}
//               {card(<>
//                 {sectionTitle(t.property.details)}
//                 <div className="grid grid-cols-2 gap-1">
//                   {[
//                     [t.property.type[property.type], "Tipologia"],
//                     [property.yearBuilt ?? "—", t.property.yearBuilt],
//                     [property.totalFloors ?? "—", "Total pisos"],
//                   ].map(([value, label]) => (
//                     <div key={String(label)} className="flex justify-between py-2 border-b text-sm"
//                       style={{ borderColor: "var(--border-color)" }}>
//                       <span style={{ color: "var(--text-muted)" }}>{label}</span>
//                       <span className="font-medium" style={{ color: "var(--text-primary)" }}>{String(value)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </>)}

//               {/* Amenities */}
//               {amenities.length > 0 && card(<>
//                 {sectionTitle("Comodidades")}
//                 <div className="flex flex-wrap gap-2">
//                   {amenities.map(({ label }) => (
//                     <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
//                       style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
//                       <CheckCircle2 className="w-3.5 h-3.5 text-gold-500" />
//                       {label}
//                     </div>
//                   ))}
//                 </div>
//               </>)}

//               {/* Map */}
//               {card(<>
//                 {sectionTitle(t.property.location)}
//                 <div className="h-72 rounded-xl overflow-hidden"
//                   style={{ border: "1px solid var(--border-color)" }}>
//                   <PropertyMap
//                     properties={[property]}
//                     center={[property.latitude, property.longitude]}
//                     zoom={15}
//                     className="w-full h-full"
//                   />
//                 </div>
//               </>)}

//               {/* Nearby places — interactive individual route */}
//               {nearbyPlaces.length > 0 && card(<>
//                 <div className="flex items-center gap-2 mb-4">
//                   {sectionTitle(t.property.nearby.title)}
//                   <span className="text-xs" style={{ color: "var(--text-muted)" }}>· {t.property.nearby.radius}</span>
//                 </div>
//                 <NearbyPlacesList
//                   places={nearbyPlaces}
//                   propertyLat={property.latitude}
//                   propertyLng={property.longitude}
//                   locale={locale}
//                 />
//               </>)}
//             </div>

//             {/* ── RIGHT sidebar ── */}
//             <div className="flex flex-col gap-4 lg:sticky lg:top-20 self-start">

//               {/* Owner */}
//               {property.owner && card(<>
//                 {sectionTitle(t.property.owner)}
//                 <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
//                   <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0 overflow-hidden"
//                     style={{ background: "var(--brand)" }}>
//                     {property.owner.avatar
//                       ? <img src={property.owner.avatar} alt="" className="w-full h-full object-cover" />
//                       : getInitials(property.owner.name)}
//                   </div>
//                   <div>
//                     <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{property.owner.name}</p>
//                     <div className="flex items-center gap-1 text-xs text-gold-500 mt-0.5">
//                       <Star className="w-3 h-3 fill-gold-500" />
//                       <span>4.9</span>
//                       <span className="ml-1" style={{ color: "var(--text-muted)" }}>· Verificado</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-2 text-sm">
//                   {property.owner.phone && (
//                     <a href={`tel:${property.owner.phone}`}
//                       className="flex items-center gap-2.5 transition-colors"
//                       style={{ color: "var(--text-muted)" }}
//                       onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
//                       onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
//                       <Phone className="w-4 h-4 text-gold-500" />
//                       {property.owner.phone}
//                     </a>
//                   )}
//                   <a href={`mailto:${property.owner.email}`}
//                     className="flex items-center gap-2.5 transition-colors"
//                     style={{ color: "var(--text-muted)" }}
//                     onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
//                     onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
//                     <Mail className="w-4 h-4 text-gold-500" />
//                     {property.owner.email}
//                   </a>
//                 </div>
//               </>)}

//               {/* Booking */}
//               <div className="rounded-2xl p-5"
//                 style={{ background: "var(--bg-card)", border: "2px solid var(--border-color)" }}>
//                 <p className="font-display text-2xl font-bold text-gold-500 mb-1">
//                   {formatPrice(property.price, locale)}
//                   {property.priceUnit === "month" && (
//                     <span className="text-sm font-sans font-normal ml-1" style={{ color: "var(--text-muted)" }}>
//                       {t.common.perMonth}
//                     </span>
//                   )}
//                 </p>
//                 <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
//                   {property.listingType === "rent" ? "Disponível para arrendamento" : "Disponível para venda"}
//                 </p>

//                 {canBook ? (
//                   <button onClick={() => setBookingOpen(true)} className="btn-primary w-full">
//                     <Calendar className="w-4 h-4" />
//                     {t.property.requestBooking}
//                   </button>
//                 ) : !session?.user ? (
//                   <Link href="/login" className="btn-primary w-full flex items-center justify-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     Entrar para reservar
//                   </Link>
//                 ) : (
//                   <p className="text-center text-sm py-2" style={{ color: "var(--text-muted)" }}>
//                     {session.user.id === property.ownerId ? "Este é o seu imóvel" : t.booking.ownerOnly}
//                   </p>
//                 )}

//                 {canFavorite && (
//                   <button onClick={handleFavorite}
//                     className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2"
//                     style={{
//                       borderColor: property.isFavorited ? "#FF385C" : "var(--border-color)",
//                       color: property.isFavorited ? "#FF385C" : "var(--text-muted)",
//                     }}>
//                     <Heart className="w-4 h-4" style={{ fill: property.isFavorited ? "#FF385C" : "none" }} />
//                     {property.isFavorited ? t.property.removeFavorite : t.property.addFavorite}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <BookingModal property={property} isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
//     </div>
//   );
// }




"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useI18n, formatPrice, formatDistance } from "@/i18n";
import { useNearbyPlaces, useToggleFavorite } from "@/hooks/useProperties";
import { BookingModal } from "./BookingModal";
import { Navbar } from "@/components/layout/Navbar";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import {
  BedDouble, Bath, Maximize2, Car, MapPin, Phone, Mail,
  Heart, Share2, ArrowLeft, Calendar, Star, CheckCircle2,
  ChevronLeft, ChevronRight, Waves, Trees, GraduationCap,
  Hospital, ShoppingCart, Bus, Dumbbell, Pill, Landmark,
  Utensils, Navigation, X,
} from "lucide-react";
import { cn, formatDate, getInitials } from "@/lib/utils";
import type { Property, NearbyPlace, NearbyPlaceType } from "@/types";

const PropertyMap = dynamic(
  () => import("@/components/map/PropertyMap").then((m) => m.PropertyMap),
  { ssr: false }
);

const SinglePlaceMap = dynamic(
  () => import("@/components/map/NearbyPlacesMap").then((m) => m.NearbyPlacesMap),
  { ssr: false }
);

const NEARBY_ICONS: Record<NearbyPlaceType, React.ElementType> = {
  school: GraduationCap, hospital: Hospital, supermarket: ShoppingCart,
  beach: Waves, restaurant: Utensils, park: Trees, pharmacy: Pill,
  bank: Landmark, transport: Bus, gym: Dumbbell,
};

const NEARBY_COLORS: Record<NearbyPlaceType, string> = {
  school:"#4A8FD4", hospital:"#E05C5C", supermarket:"#4CAF7D", beach:"#00BCD4",
  restaurant:"#FF9800", park:"#8BC34A", pharmacy:"#9C27B0", bank:"#C9A84C",
  transport:"#607D8B", gym:"#FF5722",
};

interface Props {
  property: Property & { owner?: { id:string;name:string;email:string;phone?:string;avatar?:string;createdAt:string }|null };
}

// ── NearbyPlacesList ─────────────────────────────────────────
function NearbyPlacesList({ places, propertyLat, propertyLng, locale }: {
  places: NearbyPlace[];
  propertyLat: number;
  propertyLng: number;
  locale: string;
}) {
  const [selected, setSelected] = useState<NearbyPlace | null>(null);

  const toggle = (p: NearbyPlace) => setSelected(prev => prev?.id === p.id ? null : p);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {places.slice(0, 12).map((place) => {
          const Icon  = NEARBY_ICONS[place.type] ?? MapPin;
          const color = NEARBY_COLORS[place.type] ?? "#888";
          const isOpen = selected?.id === place.id;
          const LABELS: Record<NearbyPlaceType, string> = {
            school:"Escola", hospital:"Hospital", supermarket:"Supermercado",
            beach:"Praia", restaurant:"Restaurante", park:"Parque",
            pharmacy:"Farmácia", bank:"Banco", transport:"Transporte", gym:"Ginásio",
          };
          return (
            <button
              key={place.id}
              onClick={() => toggle(place)}
              className="flex items-center gap-3 p-3 rounded-xl text-sm text-left transition-all w-full"
              style={{
                background: isOpen ? `${color}14` : "var(--bg-card)",
                border: `1px solid ${isOpen ? color : "var(--border-color)"}`,
              }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}18` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" style={{ color: "var(--text-primary)" }}>{place.name}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{LABELS[place.type] ?? place.type}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-xs font-semibold" style={{ color }}>
                  {formatDistance(place.distance, locale as "pt"|"en")}
                </span>
                <Navigation className="w-3 h-3" style={{ color: isOpen ? color : "var(--text-subtle)", opacity: 0.7 }} />
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="rounded-2xl overflow-hidden relative" style={{ border: "1px solid var(--border-color)" }}>
          <div className="absolute top-3 right-3 z-10">
            <button onClick={() => setSelected(null)}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
              <X className="w-4 h-4" style={{ color: "#222" }} />
            </button>
          </div>
          <div className="px-3 py-2 flex items-center gap-2 border-b"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
            {(() => {
              const Icon = NEARBY_ICONS[selected.type] ?? MapPin;
              const color = NEARBY_COLORS[selected.type] ?? "#888";
              return (
                <>
                  <Icon className="w-4 h-4" style={{ color }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{selected.name}</span>
                  <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>
                    {formatDistance(selected.distance, locale as "pt"|"en")} · clique no mapa para abrir direcções
                  </span>
                </>
              );
            })()}
          </div>
          <SinglePlaceMap
            propertyLat={propertyLat}
            propertyLng={propertyLng}
            places={[selected]}
            className="h-64 w-full"
          />
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export function PropertyDetailClient({ property }: Props) {
  const { data: session } = useSession();
  const { t, locale } = useI18n();
  const toggleFavorite = useToggleFavorite();
  const { data: nearbyPlaces = [] } = useNearbyPlaces(property.id);

  const [currentImage, setCurrentImage] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  const images = Array.isArray(property.images) ? property.images : [];
  const title = locale === "en" && property.titleEn ? property.titleEn : property.title;
  const description = locale === "en" && property.descriptionEn ? property.descriptionEn : property.description;

  const canBook     = session?.user?.role === "tenant";
  const canFavorite = session?.user?.role === "tenant";

  const handleFavorite = async () => {
    if (!session?.user) { toast.error(t.property.loginToFavorite); return; }
    if (!canFavorite) return;
    try {
      const res = await toggleFavorite.mutateAsync(property.id);
      toast.success(res.favorited ? "Adicionado aos favoritos ♥" : "Removido dos favoritos");
    } catch { toast.error(t.common.error); }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Link copiado!");
  };

  const amenities = [
    { label: t.property.amenities.furnished,   active: property.furnished },
    { label: t.property.amenities.petFriendly, active: property.petFriendly },
    { label: t.property.amenities.hasPool,     active: property.hasPool },
    { label: t.property.amenities.hasGarden,   active: property.hasGarden },
    { label: t.property.amenities.hasGym,      active: property.hasGym },
    { label: t.property.amenities.hasSecurity, active: property.hasSecurity },
    { label: t.property.amenities.hasElevator, active: property.hasElevator },
  ].filter(a => a.active);

  const card = (children: React.ReactNode, extra?: string) => (
    <div className={`rounded-2xl p-5 ${extra ?? ""}`}
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
      {children}
    </div>
  );

  const sectionTitle = (text: string) => (
    <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3"
      style={{ color: "var(--brand)" }}>{text}</h2>
  );

  const keyStats = [
    { Icon: BedDouble, value: property.bedrooms,    label: t.property.bedrooms },
    { Icon: Bath,      value: property.bathrooms,   label: "WC" },
    { Icon: Maximize2, value: `${property.area}m²`, label: t.property.area },
    { Icon: Car,       value: property.parkingSpots, label: t.property.parking },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Navbar />
      <main className="pt-16">

        {/* Breadcrumb */}
        <div className="page-container py-4">
          <Link href="/properties" className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
            <ArrowLeft className="w-4 h-4" /> {t.nav.properties}
          </Link>
        </div>

        {/* ── GALLERY ── */}
        <div className="page-container mb-8">
          <div className="relative rounded-2xl overflow-hidden group"
            style={{ height: "60vh", minHeight: 320, background: "var(--bg-surface)" }}>

            {images.length > 0 ? (
              <>
                <Image
                  src={images[currentImage]}
                  alt={`${title} — foto ${currentImage + 1}`}
                  fill
                  priority
                  unoptimized
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />

                {images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 2px 10px rgba(0,0,0,0.20)" }}>
                      <ChevronLeft className="w-5 h-5" style={{ color: "#222" }} />
                    </button>
                    <button onClick={() => setCurrentImage(i => (i + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 2px 10px rgba(0,0,0,0.20)" }}>
                      <ChevronRight className="w-5 h-5" style={{ color: "#222" }} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setCurrentImage(i)}
                          className="rounded-full transition-all"
                          style={{
                            width: i === currentImage ? 20 : 8, height: 8,
                            background: i === currentImage ? "#fff" : "rgba(255,255,255,0.5)",
                          }} />
                      ))}
                    </div>
                  </>
                )}

                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {images.slice(0, 5).map((img, i) => (
                      <button key={i} onClick={() => setCurrentImage(i)}
                        className="w-14 h-14 rounded-xl overflow-hidden transition-all"
                        style={{
                          outline: i === currentImage ? "2.5px solid #fff" : "none",
                          outlineOffset: 2,
                          opacity: i === currentImage ? 1 : 0.62,
                        }}>
                        <img src={img} alt="" className="w-full h-full object-cover" loading="eager" />
                      </button>
                    ))}
                    {images.length > 5 && (
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: "rgba(0,0,0,0.55)" }}>
                        +{images.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🏠</div>
            )}

            <div className="absolute top-4 left-4 flex gap-2">
              <span className={cn("badge shadow-sm", property.listingType === "rent" ? "badge-rent" : "badge-sale")}>
                {property.listingType === "rent" ? t.home.forRent : t.home.forSale}
              </span>
              <span className="badge shadow-sm"
                style={{ background: "rgba(255,255,255,0.92)", color: "#222", border: "none" }}>
                {t.property.type[property.type]}
              </span>
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              {canFavorite && (
                <button onClick={handleFavorite}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 1px 6px rgba(0,0,0,0.20)" }}>
                  <Heart className="w-5 h-5" style={{
                    stroke: property.isFavorited ? "#FF385C" : "#222",
                    fill: property.isFavorited ? "#FF385C" : "none",
                    strokeWidth: 2,
                  }} />
                </button>
              )}
              <button onClick={handleShare}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 1px 6px rgba(0,0,0,0.20)" }}>
                <Share2 className="w-5 h-5" style={{ color: "#222" }} />
              </button>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="page-container pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── LEFT ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Title + price */}
              <div>
                <p className="font-display text-4xl font-bold text-gold-500 mb-1">
                  {formatPrice(property.price, locale)}
                  {property.priceUnit === "month" && (
                    <span className="text-base font-sans font-normal ml-2" style={{ color: "var(--text-muted)" }}>
                      {t.common.perMonth}
                    </span>
                  )}
                </p>
                <h1 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{title}</h1>
                <p className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                  <MapPin className="w-4 h-4 shrink-0 text-gold-500" />
                  {property.address}, {property.city}, {property.province}
                </p>
              </div>

              {/* Key stats — inlined to allow key prop */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {keyStats.map(({ Icon, value, label }) => (
                  <div key={label} className="rounded-2xl p-5"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                    <div className="text-center">
                      <Icon className="w-5 h-5 text-gold-500 mx-auto mb-2" />
                      <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {card(<>
                {sectionTitle(t.property.description)}
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{description}</p>
              </>)}

              {/* Details */}
              {card(<>
                {sectionTitle(t.property.details)}
                <div className="grid grid-cols-2 gap-1">
                  {[
                    [t.property.type[property.type], "Tipologia"],
                    [property.yearBuilt ?? "—", t.property.yearBuilt],
                    [property.totalFloors ?? "—", "Total pisos"],
                  ].map(([value, label]) => (
                    <div key={String(label)} className="flex justify-between py-2 border-b text-sm"
                      style={{ borderColor: "var(--border-color)" }}>
                      <span style={{ color: "var(--text-muted)" }}>{label}</span>
                      <span className="font-medium" style={{ color: "var(--text-primary)" }}>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </>)}

              {/* Amenities */}
              {amenities.length > 0 && card(<>
                {sectionTitle("Comodidades")}
                <div className="flex flex-wrap gap-2">
                  {amenities.map(({ label }) => (
                    <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-500" />
                      {label}
                    </div>
                  ))}
                </div>
              </>)}

              {/* Map */}
              {card(<>
                {sectionTitle(t.property.location)}
                <div className="h-72 rounded-xl overflow-hidden"
                  style={{ border: "1px solid var(--border-color)" }}>
                  <PropertyMap
                    properties={[property]}
                    center={[property.latitude, property.longitude]}
                    zoom={15}
                    className="w-full h-full"
                  />
                </div>
              </>)}

              {/* Nearby places */}
              {nearbyPlaces.length > 0 && card(<>
                <div className="flex items-center gap-2 mb-4">
                  {sectionTitle(t.property.nearby.title)}
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>· {t.property.nearby.radius}</span>
                </div>
                <NearbyPlacesList
                  places={nearbyPlaces}
                  propertyLat={property.latitude}
                  propertyLng={property.longitude}
                  locale={locale}
                />
              </>)}
            </div>

            {/* ── RIGHT sidebar ── */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-20 self-start">

              {/* Owner */}
              {property.owner && card(<>
                {sectionTitle(t.property.owner)}
                <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0 overflow-hidden"
                    style={{ background: "var(--brand)" }}>
                    {property.owner.avatar
                      ? <img src={property.owner.avatar} alt="" className="w-full h-full object-cover" />
                      : getInitials(property.owner.name)}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{property.owner.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gold-500 mt-0.5">
                      <Star className="w-3 h-3 fill-gold-500" />
                      <span>4.9</span>
                      <span className="ml-1" style={{ color: "var(--text-muted)" }}>· Verificado</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  {property.owner.phone && (
                    <a href={`tel:${property.owner.phone}`}
                      className="flex items-center gap-2.5 transition-colors"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                      <Phone className="w-4 h-4 text-gold-500" />
                      {property.owner.phone}
                    </a>
                  )}
                  <a href={`mailto:${property.owner.email}`}
                    className="flex items-center gap-2.5 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                    <Mail className="w-4 h-4 text-gold-500" />
                    {property.owner.email}
                  </a>
                </div>
              </>)}

              {/* Booking */}
              <div className="rounded-2xl p-5"
                style={{ background: "var(--bg-card)", border: "2px solid var(--border-color)" }}>
                <p className="font-display text-2xl font-bold text-gold-500 mb-1">
                  {formatPrice(property.price, locale)}
                  {property.priceUnit === "month" && (
                    <span className="text-sm font-sans font-normal ml-1" style={{ color: "var(--text-muted)" }}>
                      {t.common.perMonth}
                    </span>
                  )}
                </p>
                <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                  {property.listingType === "rent" ? "Disponível para arrendamento" : "Disponível para venda"}
                </p>

                {canBook ? (
                  <button onClick={() => setBookingOpen(true)} className="btn-primary w-full">
                    <Calendar className="w-4 h-4" />
                    {t.property.requestBooking}
                  </button>
                ) : !session?.user ? (
                  <Link href="/login" className="btn-primary w-full flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Entrar para reservar
                  </Link>
                ) : (
                  <p className="text-center text-sm py-2" style={{ color: "var(--text-muted)" }}>
                    {session.user.id === property.ownerId ? "Este é o seu imóvel" : t.booking.ownerOnly}
                  </p>
                )}

                {canFavorite && (
                  <button onClick={handleFavorite}
                    className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2"
                    style={{
                      borderColor: property.isFavorited ? "#FF385C" : "var(--border-color)",
                      color: property.isFavorited ? "#FF385C" : "var(--text-muted)",
                    }}>
                    <Heart className="w-4 h-4" style={{ fill: property.isFavorited ? "#FF385C" : "none" }} />
                    {property.isFavorited ? t.property.removeFavorite : t.property.addFavorite}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BookingModal property={property} isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}