"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { OSM_ATTRIBUTION, OSM_TILES_URL } from "@/shared/constants/map";
import { DEFAULT_ZOOM, GDANSK_CENTER } from "../constants";
import type { LatLng, Vehicle, VehicleId } from "../types";
import { FlyToVehicle } from "./_internal/fly-to-vehicle";
import { VehicleMarkersLayer } from "./vehicle-markers-layer";

export function TransitMap({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  flyToTarget,
}: {
  vehicles: Vehicle[];
  selectedVehicleId: VehicleId | null;
  onSelectVehicle: (id: VehicleId) => void;
  flyToTarget: LatLng | null;
}) {
  return (
    <MapContainer
      center={GDANSK_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full"
      aria-label="Mapa Gdańska z pozycjami pojazdów komunikacji publicznej"
    >
      <TileLayer url={OSM_TILES_URL} attribution={OSM_ATTRIBUTION} />
      <VehicleMarkersLayer
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={onSelectVehicle}
      />
      <FlyToVehicle target={flyToTarget} />
    </MapContainer>
  );
}
