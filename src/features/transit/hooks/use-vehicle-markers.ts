"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import type { TrackedMarker, Vehicle, VehicleId } from "../types";
import {
  addTrackedMarker,
  advanceMarker,
  removeStaleMarkers,
  retargetMarker,
} from "../utils/tracked-markers";

/**
 * Keeps one raw Leaflet marker per vehicle and animates it between GPS
 * fixes with requestAnimationFrame — never through React state, which
 * would re-render ~200 markers every frame. See
 * docs/decisions/0006-realtime-map-rendering.md.
 */
export function useVehicleMarkers(
  vehicles: Vehicle[],
  selectedVehicleId: VehicleId | null,
  onSelectVehicle: (id: VehicleId) => void,
) {
  const map = useMap();
  const markersRef = useRef<Map<VehicleId, TrackedMarker>>(new Map());
  const onSelectRef = useRef(onSelectVehicle);
  useEffect(() => {
    onSelectRef.current = onSelectVehicle;
  });

  // Reconcile with the latest snapshot (also re-skins on selection change).
  useEffect(() => {
    const tracked = markersRef.current;
    const now = performance.now();
    for (const vehicle of vehicles) {
      const selected = vehicle.id === selectedVehicleId;
      const existing = tracked.get(vehicle.id);
      if (existing) {
        retargetMarker(existing, vehicle, selected, now);
        continue;
      }
      const select = () => onSelectRef.current(vehicle.id);
      tracked.set(vehicle.id, addTrackedMarker(map, vehicle, selected, select, now));
    }
    removeStaleMarkers(tracked, new Set(vehicles.map((v) => v.id)));
  }, [vehicles, map, selectedVehicleId]);

  useEffect(() => {
    let frame: number;
    const tick = () => {
      const now = performance.now();
      for (const entry of markersRef.current.values()) advanceMarker(entry, now);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const tracked = markersRef.current;
    return () => {
      for (const entry of tracked.values()) entry.marker.remove();
      tracked.clear();
    };
  }, [map]);
}
