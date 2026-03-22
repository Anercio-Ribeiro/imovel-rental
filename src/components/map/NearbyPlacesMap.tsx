"use client";
// NearbyPlacesMap — shows property + nearby places, draws route line to selected place
import { useEffect, useRef } from "react";
import type { NearbyPlace } from "@/types";

const PLACE_COLORS: Record<string, string> = {
  school:"#4A8FD4", hospital:"#E05C5C", supermarket:"#4CAF7D", beach:"#00BCD4",
  restaurant:"#FF9800", park:"#8BC34A", pharmacy:"#9C27B0", bank:"#C9A84C",
  transport:"#607D8B", gym:"#FF5722",
};
const PLACE_EMOJI: Record<string, string> = {
  school:"🏫", hospital:"🏥", supermarket:"🛒", beach:"🏖️",
  restaurant:"🍽️", park:"🌳", pharmacy:"💊", bank:"🏦", transport:"🚌", gym:"💪",
};

interface Props {
  propertyLat: number;
  propertyLng: number;
  places: NearbyPlace[];
  className?: string;
}

export function NearbyPlacesMap({ propertyLat, propertyLng, places, className = "h-72 w-full" }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef     = useRef<{ remove:()=>void;fitBounds:(b:unknown,o?:unknown)=>void } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;
    let destroyed = false;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (destroyed || !wrapperRef.current) return;

      const div = document.createElement("div");
      div.style.cssText = "width:100%;height:100%;";
      wrapperRef.current.appendChild(div);

      const map = L.map(div, { center: [propertyLat, propertyLng], zoom: 14 });
      mapRef.current = map as typeof mapRef.current;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19, subdomains: "abcd",
      }).addTo(map as never);

      // Property pin
      L.marker([propertyLat, propertyLng], {
        icon: L.divIcon({
          html: `<div style="font-size:26px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.35))">🏠</div>`,
          className: "", iconAnchor: [13, 26],
        }),
      }).addTo(map as never).bindPopup("<strong>Imóvel</strong>").openPopup();

      const bounds: [number, number][] = [[propertyLat, propertyLng]];

      places.forEach((place) => {
        const color = PLACE_COLORS[place.type] ?? "#C9A84C";
        const emoji = PLACE_EMOJI[place.type] ?? "📍";
        const dist  = place.distance < 1000 ? `${place.distance}m` : `${(place.distance/1000).toFixed(1)}km`;

        // Dashed route line from property to this place
        L.polyline(
          [[propertyLat, propertyLng], [place.latitude, place.longitude]],
          { color, weight: 2.5, dashArray: "6 5", opacity: 0.8 }
        ).addTo(map as never);

        // Direction arrow midpoint
        const midLat = (propertyLat + place.latitude) / 2;
        const midLng = (propertyLng + place.longitude) / 2;
        const angle  = Math.atan2(place.longitude - propertyLng, place.latitude - propertyLat) * 180 / Math.PI;
        L.marker([midLat, midLng], {
          icon: L.divIcon({
            html: `<div style="font-size:12px;transform:rotate(${angle}deg);color:${color};font-weight:bold;">➤</div>`,
            className: "", iconAnchor: [8, 8],
          }),
        }).addTo(map as never);

        // Place marker
        L.marker([place.latitude, place.longitude], {
          icon: L.divIcon({
            html: `<div style="
              background:${color};
              color:#fff;font-size:13px;
              width:32px;height:32px;border-radius:50%;
              display:flex;align-items:center;justify-content:center;
              border:2.5px solid #fff;
              box-shadow:0 2px 8px rgba(0,0,0,0.25);
            ">${emoji}</div>`,
            className: "", iconAnchor: [16, 16],
          }),
        }).addTo(map as never).bindPopup(`
          <div style="font-family:system-ui;padding:4px 0">
            <strong style="font-size:13px">${place.name}</strong><br/>
            <span style="font-size:11px;color:#666">${dist} do imóvel</span><br/>
            <a href="https://www.google.com/maps/dir/${propertyLat},${propertyLng}/${place.latitude},${place.longitude}"
               target="_blank" rel="noopener"
               style="font-size:11px;color:#FF385C;font-weight:600;text-decoration:none;">
              🗺️ Ver rota no Google Maps
            </a>
          </div>
        `);

        bounds.push([place.latitude, place.longitude]);
      });

      // Fit map to show property + all places
      if (bounds.length > 1) {
        (map as { fitBounds:(b:unknown,o:unknown)=>void }).fitBounds(
          bounds as unknown,
          { padding: [40, 40] } as unknown
        );
      }
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

  return <div ref={wrapperRef} className={className} style={{ zIndex: 0 }} />;
}
