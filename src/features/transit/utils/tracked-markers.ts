import L from "leaflet";
import { POLL_INTERVAL_MS } from "../constants";
import type { TrackedMarker, Vehicle, VehicleId } from "../types";
import { formatVehicleTooltip } from "./format";
import { interpolateLatLng } from "./interpolate";
import { createVehicleIcon } from "./marker-icon";

// Client-only (Leaflet): imported directly, never through utils/index.ts.

function vehicleIcon(vehicle: Vehicle, selected: boolean): L.DivIcon {
  return createVehicleIcon(vehicle.direction, vehicle.vehicleType, selected);
}

/** Adds a new vehicle's marker to the map, parked at its reported position. */
export function addTrackedMarker(
  map: L.Map,
  vehicle: Vehicle,
  selected: boolean,
  onClick: () => void,
  now: number,
): TrackedMarker {
  const marker = L.marker([vehicle.lat, vehicle.lon], {
    icon: vehicleIcon(vehicle, selected),
    // Keyboard access to vehicles is via the list panel, not 200 individual
    // map tab-stops — see docs/decisions/0006-realtime-map-rendering.md.
    keyboard: false,
  })
    .addTo(map)
    .on("click", onClick);
  marker.bindTooltip(formatVehicleTooltip(vehicle));

  const position = { lat: vehicle.lat, lon: vehicle.lon };
  return {
    marker,
    from: position,
    to: position,
    fromTime: now,
    toTime: now,
    currentLat: vehicle.lat,
    currentLon: vehicle.lon,
  };
}

/** Points an existing marker at the vehicle's new position, animating from
 * wherever it currently is (not its last target), so a late update never
 * makes it jump. */
export function retargetMarker(
  entry: TrackedMarker,
  vehicle: Vehicle,
  selected: boolean,
  now: number,
): void {
  entry.from = { lat: entry.currentLat, lon: entry.currentLon };
  entry.to = { lat: vehicle.lat, lon: vehicle.lon };
  entry.fromTime = now;
  entry.toTime = now + POLL_INTERVAL_MS;
  entry.marker.setIcon(vehicleIcon(vehicle, selected));
  entry.marker.setTooltipContent(formatVehicleTooltip(vehicle));
}

/** Removes markers of vehicles that are no longer reported. */
export function removeStaleMarkers(
  tracked: Map<VehicleId, TrackedMarker>,
  reported: Set<VehicleId>,
): void {
  for (const [id, entry] of tracked) {
    if (reported.has(id)) continue;
    entry.marker.remove();
    tracked.delete(id);
  }
}

/** Moves a marker to its interpolated position for this animation frame. */
export function advanceMarker(entry: TrackedMarker, now: number): void {
  const span = entry.toTime - entry.fromTime;
  const t = span <= 0 ? 1 : (now - entry.fromTime) / span;
  const position = interpolateLatLng(entry.from, entry.to, t);
  entry.currentLat = position.lat;
  entry.currentLon = position.lon;
  entry.marker.setLatLng([position.lat, position.lon]);
}
