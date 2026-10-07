"use client";

import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { OSM_ATTRIBUTION, OSM_TILES_URL } from "@/shared/constants/map";
import { DEFAULT_ZOOM, GDANSK_CENTER } from "../constants";
import type { Incident, LatLngTuple } from "../types";
import { mapFocusTarget } from "../utils/map-focus";
import { createPickedIcon } from "../utils/marker-icon";
import { FlyTo } from "./_internal/fly-to";
import { IncidentMarker } from "./_internal/incident-marker";
import { PickOnClick } from "./_internal/pick-on-click";

type Props = {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** The draft's location, shown while the form is open. */
  picked: LatLngTuple | null;
  /** Set only while the form's location step is active. */
  onPick?: (lat: number, lon: number) => void;
};

export const IncidentMap = ({
  incidents,
  selectedId,
  onSelect,
  picked,
  onPick,
}: Props) => {
  const selected = incidents.find((incident) => incident.id === selectedId);
  const flyTarget = mapFocusTarget(selected, picked, Boolean(onPick));
  const pickedIcon = useMemo(() => createPickedIcon(), []);

  return (
    <MapContainer
      center={GDANSK_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className={onPick ? "h-full w-full cursor-crosshair" : "h-full w-full"}
      aria-label="Mapa incydentów w Gdańsku. Te same incydenty są na liście obok mapy."
    >
      <TileLayer url={OSM_TILES_URL} attribution={OSM_ATTRIBUTION} />
      {incidents.map((incident) => (
        <IncidentMarker
          key={incident.id}
          incident={incident}
          selected={incident.id === selectedId}
          onSelect={onSelect}
        />
      ))}
      {picked && <Marker position={picked} icon={pickedIcon} keyboard={false} />}
      {onPick && <PickOnClick onPick={onPick} />}
      <FlyTo target={flyTarget} onlyIfHidden={!selected} />
    </MapContainer>
  );
};
