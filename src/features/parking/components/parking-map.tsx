"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { OSM_ATTRIBUTION, OSM_TILES_URL } from "@/shared/constants/map";
import { DEFAULT_ZOOM, GDANSK_CENTER } from "../constants";
import type { ParkingLot, ParkingLotId } from "../types";
import { FlyToLot } from "./_internal/fly-to-lot";
import { LotMarker } from "./_internal/lot-marker";

type Props = {
  lots: ParkingLot[];
  selectedLotId: ParkingLotId | null;
  onSelectLot: (id: ParkingLotId) => void;
};

export const ParkingMap = ({ lots, selectedLotId, onSelectLot }: Props) => {
  const selectedLot = lots.find((lot) => lot.id === selectedLotId) ?? null;
  return (
    <MapContainer
      center={GDANSK_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full"
      aria-label="Mapa parkingów w Gdańsku z liczbą wolnych miejsc. Te same dane są w tabeli poniżej."
    >
      <TileLayer url={OSM_TILES_URL} attribution={OSM_ATTRIBUTION} />
      {lots.map((lot) => (
        <LotMarker
          key={lot.id}
          lot={lot}
          selected={lot.id === selectedLotId}
          onSelect={onSelectLot}
        />
      ))}
      <FlyToLot target={selectedLot} />
    </MapContainer>
  );
};
