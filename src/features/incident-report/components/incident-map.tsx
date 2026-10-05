"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  CATEGORY_LABELS,
  DEFAULT_ZOOM,
  GDANSK_CENTER,
  SEVERITY_LABELS,
  STATUS_LABELS,
} from "../constants";
import { formatDateTime } from "../lib/format";
import type { Incident } from "../types";

// Same no-key OSM tiles as the transit/parking maps (dark mode is handled
// globally by the `.dark .leaflet-tile-pane` filter in globals.css).
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

/** A severity-colored dot; a `new` incident additionally gets a pulsing ring
 * and a visible "NOWY INCYDENT" label, so newness never depends on color or
 * motion alone (WCAG 1.4.1, 2.3.3 — the pulse stops under reduced motion).
 * The sr-only text is the marker's accessible name. */
function createIcon(incident: Incident, selected: boolean): L.DivIcon {
  const isNew = incident.status === "new";
  const classes = [
    "incident-marker",
    `incident-marker--${incident.severity}`,
  ];
  if (isNew) classes.push("incident-marker--new");
  if (selected) classes.push("incident-marker--selected");
  const spoken = `${STATUS_LABELS[incident.status]}: ${incident.title}, ${incident.address}`;
  return L.divIcon({
    className: "incident-marker-icon",
    html:
      `<span class="${classes.join(" ")}">` +
      `<span class="sr-only">${escapeHtml(spoken)}</span>` +
      (isNew ? '<span class="incident-marker__pulse" aria-hidden="true"></span>' : "") +
      '<span class="incident-marker__dot" aria-hidden="true"></span>' +
      (isNew
        ? '<span class="incident-marker__label" aria-hidden="true">NOWY INCYDENT</span>'
        : "") +
      "</span>",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
}

const PICKED_ICON = L.divIcon({
  className: "incident-marker-icon",
  html: '<span class="incident-picked"><span class="sr-only">Wybrane miejsce zgłoszenia</span></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function IncidentMarker({
  incident,
  selected,
  onSelect,
}: {
  incident: Incident;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const icon = useMemo(() => createIcon(incident, selected), [incident, selected]);
  return (
    <Marker
      position={[incident.lat, incident.lon]}
      icon={icon}
      eventHandlers={{ click: () => onSelect(incident.id) }}
      zIndexOffset={incident.status === "new" ? 1000 : selected ? 500 : 0}
    >
      <Popup>
        <div className="flex flex-col gap-1 text-sm">
          <strong>{incident.title}</strong>
          <span>{incident.address}</span>
          <span>
            {CATEGORY_LABELS[incident.category]} · zagrożenie{" "}
            {SEVERITY_LABELS[incident.severity].toLowerCase()}
          </span>
          <span>Status: {STATUS_LABELS[incident.status]}</span>
          <span>{formatDateTime(incident.occurredAt)}</span>
        </div>
      </Popup>
    </Marker>
  );
}

/** Flies to a selected incident. For the picked location only pans when
 * the point is off-screen (e.g. a district chosen from the list) — a map
 * click shouldn't move the map out from under the cursor. */
function FlyTo({
  target,
  onlyIfHidden,
}: {
  target: [number, number] | null;
  onlyIfHidden: boolean;
}) {
  const map = useMap();
  const lat = target?.[0];
  const lon = target?.[1];
  useEffect(() => {
    if (lat === undefined || lon === undefined) return;
    if (onlyIfHidden && map.getBounds().contains([lat, lon])) return;
    map.flyTo([lat, lon], Math.max(map.getZoom(), 15), { duration: 0.75 });
  }, [map, lat, lon, onlyIfHidden]);
  return null;
}

function PickOnClick({ onPick }: { onPick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click: (event) => onPick(event.latlng.lat, event.latlng.lng),
  });
  return null;
}

export function IncidentMap({
  incidents,
  selectedId,
  onSelect,
  picked,
  onPick,
}: {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** The draft's location, shown while the form is open. */
  picked: [number, number] | null;
  /** Set only while the form's location step is active. */
  onPick?: (lat: number, lon: number) => void;
}) {
  const selected = incidents.find((incident) => incident.id === selectedId);
  const flyTarget: [number, number] | null = selected
    ? [selected.lat, selected.lon]
    : onPick
      ? picked
      : null;

  return (
    <MapContainer
      center={GDANSK_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className={onPick ? "h-full w-full cursor-crosshair" : "h-full w-full"}
      aria-label="Mapa incydentów w Gdańsku. Te same incydenty są na liście obok mapy."
    >
      <TileLayer url={OSM_TILES} attribution={ATTRIBUTION} />
      {incidents.map((incident) => (
        <IncidentMarker
          key={incident.id}
          incident={incident}
          selected={incident.id === selectedId}
          onSelect={onSelect}
        />
      ))}
      {picked && <Marker position={picked} icon={PICKED_ICON} keyboard={false} />}
      {onPick && <PickOnClick onPick={onPick} />}
      <FlyTo target={flyTarget} onlyIfHidden={!selected} />
    </MapContainer>
  );
}
