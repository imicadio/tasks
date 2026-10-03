"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import { DEFAULT_ZOOM, GDANSK_CENTER } from "../constants";
import { spotsWord } from "../lib/format";
import type { ParkingLot, ParkingLotId } from "../types";

// Same no-key OSM tiles as the transit map (dark mode is handled globally
// by the `.dark .leaflet-tile-pane` filter in globals.css).
const OSM_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** The marker's visible label is the free-spot count itself, so status
 * never depends on color alone (WCAG 1.4.1). Leaflet renders a keyboard-
 * focusable `role="button"` for each marker; the sr-only text gives it a
 * full accessible name ("P01 Galeria Bałtycka: 869 wolnych miejsc"). */
function createIcon(lot: ParkingLot, selected: boolean): L.DivIcon {
  const current = lot.status !== "unknown" && lot.availableSpots !== null;
  const visible = current ? String(lot.availableSpots) : "?";
  const spoken = current
    ? `${lot.availableSpots} wolnych ${spotsWord(lot.availableSpots!)}`
    : "brak aktualnych danych";
  const classes = ["parking-marker", `parking-marker--${lot.status}`];
  if (selected) classes.push("parking-marker--selected");
  return L.divIcon({
    className: "parking-marker-icon",
    html: `<span class="${classes.join(" ")}"><span class="sr-only">${escapeHtml(`${lot.shortName} ${lot.name}: ${spoken}`)}</span><span aria-hidden="true">${visible}</span></span>`,
    iconSize: [44, 26],
    iconAnchor: [22, 13],
  });
}

function FlyToLot({ target }: { target: ParkingLot | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lon], Math.max(map.getZoom(), 15), {
      duration: 0.75,
    });
    // Only fly when the selected lot changes, not on every data refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.id]);
  return null;
}

function LotMarker({
  lot,
  selected,
  onSelect,
}: {
  lot: ParkingLot;
  selected: boolean;
  onSelect: (id: ParkingLotId) => void;
}) {
  const icon = useMemo(() => createIcon(lot, selected), [lot, selected]);
  return (
    <Marker
      position={[lot.lat, lot.lon]}
      icon={icon}
      eventHandlers={{ click: () => onSelect(lot.id) }}
      zIndexOffset={selected ? 1000 : 0}
    >
      <Tooltip>{`${lot.shortName} · ${lot.name}`}</Tooltip>
    </Marker>
  );
}

export function ParkingMap({
  lots,
  selectedLotId,
  onSelectLot,
}: {
  lots: ParkingLot[];
  selectedLotId: ParkingLotId | null;
  onSelectLot: (id: ParkingLotId) => void;
}) {
  const selectedLot = lots.find((lot) => lot.id === selectedLotId) ?? null;
  return (
    <MapContainer
      center={GDANSK_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full"
      aria-label="Mapa parkingów w Gdańsku z liczbą wolnych miejsc. Te same dane są w tabeli poniżej."
    >
      <TileLayer url={OSM_TILES} attribution={ATTRIBUTION} />
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
}
