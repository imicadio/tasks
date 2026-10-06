import type L from "leaflet";

export type LatLng = { lat: number; lon: number };

/** A Leaflet marker plus the state needed to animate it between two GPS
 * fixes — see components/vehicle-markers-layer.tsx. */
export type TrackedMarker = {
  marker: L.Marker;
  from: LatLng;
  to: LatLng;
  fromTime: number;
  toTime: number;
  currentLat: number;
  currentLon: number;
};
