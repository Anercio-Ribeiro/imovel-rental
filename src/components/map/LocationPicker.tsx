"use client";
// ============================================================
// src/components/map/LocationPicker.tsx
// ============================================================
import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface Props {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number, address?: string) => void;
  className?: string;
}

export function LocationPicker({ lat, lng, onChange, className = "h-64 w-full" }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef     = useRef<{ remove:()=>void } | null>(null);
  const markerRef  = useRef<{ setLatLng:(ll:[number,number])=>void; getLatLng:()=>{ lat:number; lng:number } } | null>(null);
  const [coords, setCoords]     = useState({ lat, lng });
  const [geocoding, setGeocoding] = useState(false);

  const reverseGeocode = async (la: number, lo: number) => {
    try {
      setGeocoding(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${la}&lon=${lo}&format=json`,
        { headers: { "Accept-Language": "pt" } }
      );
      if (!res.ok) return;
      const d = await res.json() as { address?: { road?: string; suburb?: string; city?: string; state?: string } };
      const parts = [d.address?.road, d.address?.suburb, d.address?.city ?? d.address?.state].filter(Boolean);
      onChange(la, lo, parts.join(", "));
    } catch {
      onChange(la, lo);
    } finally {
      setGeocoding(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;
    let destroyed = false;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (destroyed || !wrapperRef.current) return;

      // Fresh div to avoid _leaflet_id collision
      const div = document.createElement("div");
      div.style.cssText = "width:100%;height:100%;";
      wrapperRef.current.appendChild(div);

      const map = L.map(div, { center: [lat, lng], zoom: 13 });
      mapRef.current = map as typeof mapRef.current;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19, subdomains: "abcd",
      }).addTo(map as never);

      const icon = L.divIcon({
        html: `<div style="font-size:28px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">📍</div>`,
        className: "", iconAnchor: [14, 28],
      });

      const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map as never);
      markerRef.current = marker as typeof markerRef.current;

      (map as { on:(e:string,cb:(e:{latlng:{lat:number;lng:number}})=>void)=>void }).on("click", async (e) => {
        const { lat: la, lng: lo } = e.latlng;
        marker.setLatLng([la, lo]);
        setCoords({ lat: la, lng: lo });
        await reverseGeocode(la, lo);
      });

      (marker as { on:(e:string,cb:()=>void)=>void }).on("dragend", async () => {
        const pos = (marker as { getLatLng:()=>{ lat:number; lng:number } }).getLatLng();
        setCoords({ lat: pos.lat, lng: pos.lng });
        await reverseGeocode(pos.lat, pos.lng);
      });
    };

    init();

    return () => {
      destroyed = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      const div = wrapperRef.current?.querySelector("div");
      if (div) div.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div ref={wrapperRef} className={className}
        style={{ zIndex: 0, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-color)" }} />
      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
        <MapPin className="w-3 h-3 text-gold-500 shrink-0" />
        {geocoding ? (
          <span>A obter endereço…</span>
        ) : (
          <span>
            Lat: <strong style={{ color: "var(--text-primary)" }}>{coords.lat.toFixed(6)}</strong>
            {" · "}Lng: <strong style={{ color: "var(--text-primary)" }}>{coords.lng.toFixed(6)}</strong>
            {" · "}Clique no mapa para posicionar
          </span>
        )}
      </div>
    </div>
  );
}
