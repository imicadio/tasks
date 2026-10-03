"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { VehicleMarkersLayer } from "./vehicle-markers-layer";
import { GDANSK_CENTER, DEFAULT_ZOOM } from "../constants";
import type { Vehicle, VehicleId } from "../types";

// OpenStreetMap's own standard tile server — verified working with no API
// key (CARTO's basemaps, used in an earlier draft of this file, turned out
// to require one despite being commonly cited as free; this is the one
// actually confirmed with a live request). There's no free, no-key dark
// tile set to match, so dark mode reuses these same tiles under a CSS
// filter (invert + hue-rotate) instead of fetching from a second,
// unverified provider — see docs/decisions/0006-realtime-map-rendering.md.
const OSM_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function FlyToVehicle({
  target,
}: {
  target: { lat: number; lon: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lon], Math.max(map.getZoom(), 15), {
      duration: 0.75,
    });
    // Only fly when the target identity changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.lat, target?.lon]);
  return null;
}

export function TransitMap({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  flyToTarget,
}: {
  vehicles: Vehicle[];
  selectedVehicleId: VehicleId | null;
  onSelectVehicle: (id: VehicleId) => void;
  flyToTarget: { lat: number; lon: number } | null;
}) {
  return (
    <MapContainer
      center={GDANSK_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full"
      aria-label="Mapa Gdańska z pozycjami pojazdów komunikacji publicznej"
    >
      <TileLayer url={OSM_TILES} attribution={ATTRIBUTION} />
      <VehicleMarkersLayer
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={onSelectVehicle}
      />
      <FlyToVehicle target={flyToTarget} />
    </MapContainer>
  );
}
