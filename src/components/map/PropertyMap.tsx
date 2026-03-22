"use client";
// ============================================================
// src/components/map/PropertyMap.tsx
// ============================================================
import { useEffect, useRef } from "react";
import type { Property } from "@/types";
import { useI18n, formatPrice } from "@/i18n";

interface PropertyMapProps {
  properties: Property[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function PropertyMap({
  properties,
  selectedId,
  onSelect,
  center,
  zoom = 12,
  className = "h-full w-full",
}: PropertyMapProps) {
  // We use a stable wrapper div; the actual map div is created/destroyed manually
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapDivRef  = useRef<HTMLDivElement | null>(null);
  const mapRef     = useRef<{ remove:()=>void; flyTo:(c:[number,number],z:number)=>void } | null>(null);
  const { locale, t } = useI18n();

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;
    let destroyed = false;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (destroyed || !wrapperRef.current) return;

      // Create a fresh div inside the wrapper — avoids "_leaflet_id already set"
      const div = document.createElement("div");
      div.style.cssText = "width:100%;height:100%;";
      wrapperRef.current.appendChild(div);
      mapDivRef.current = div;

      const defaultCenter: [number, number] = center ?? [-8.8368, 13.2343];
      const map = L.map(div, { center: defaultCenter, zoom, zoomControl: true });
      mapRef.current = map as typeof mapRef.current;

      // Colorful CartoDB Voyager tiles (free, vibrant)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map as never);

      properties.forEach((prop) => {
        const lat = Number(prop.latitude);
        const lng = Number(prop.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const price    = formatPrice(prop.price, locale);
        const title    = (locale === "en" && prop.titleEn ? prop.titleEn : prop.title) ?? "";
        const short    = title.length > 20 ? title.slice(0, 20) + "…" : title;
        const active   = prop.id === selectedId;
        const images   = Array.isArray(prop.images) ? prop.images : [];

        const icon = L.divIcon({
          html: `
            <div style="display:flex;flex-direction:column;align-items:center;gap:0;cursor:pointer;">
              <div style="
                background:${active ? "#C9A84C" : "#fff"};
                border:2px solid ${active ? "#8A6B28" : "#C9A84C"};
                border-radius:10px;padding:4px 8px 3px;
                font-family:system-ui,sans-serif;
                font-size:11px;font-weight:700;
                color:${active ? "#0D0D0F" : "#1A1814"};
                white-space:nowrap;
                box-shadow:0 2px 10px rgba(0,0,0,0.18);
                display:flex;align-items:center;gap:4px;
              ">
                <span style="font-size:14px;">🏠</span>
                <span>${short}</span>
              </div>
              <div style="
                width:0;height:0;
                border-left:5px solid transparent;
                border-right:5px solid transparent;
                border-top:6px solid ${active ? "#C9A84C" : "#C9A84C"};
              "></div>
            </div>`,
          className: "",
          iconAnchor: [50, 46],
          popupAnchor: [0, -50],
        });

        const marker = L.marker([lat, lng], { icon })
          .addTo(map as never)
          .bindPopup(`
            <div style="font-family:system-ui,sans-serif;min-width:190px;border-radius:10px;overflow:hidden;">
              ${images[0] ? `<img src="${images[0]}" style="width:100%;height:90px;object-fit:cover;display:block;"/>` : ""}
              <div style="padding:10px 12px">
                <div style="font-size:14px;font-weight:700;color:#C9A84C;margin-bottom:3px;">${price}</div>
                <div style="font-size:12px;color:#333;margin-bottom:6px;line-height:1.4">${title}</div>
                <a href="/properties/${prop.id}" style="
                  display:inline-block;padding:5px 12px;background:#C9A84C;
                  color:#0D0D0F;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none;
                ">${t.common.seeDetails}</a>
              </div>
            </div>
          `, { maxWidth: 220 });

        marker.on("click", () => onSelect?.(prop.id));
      });
    };

    init();

    return () => {
      destroyed = true;
      // Destroy map and remove the inner div from wrapper
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (mapDivRef.current && wrapperRef.current?.contains(mapDivRef.current)) {
        wrapperRef.current.removeChild(mapDivRef.current);
      }
      mapDivRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to selected
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const prop = properties.find((p) => p.id === selectedId);
    if (prop) mapRef.current.flyTo([Number(prop.latitude), Number(prop.longitude)], 15);
  }, [selectedId, properties]);

  return <div ref={wrapperRef} className={className} style={{ zIndex: 0, minHeight: 200 }} />;
}
