"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { POLL_INTERVAL_MS } from "../constants";
import type { TrackedMarker, Vehicle, VehicleId } from "../types";
import { formatVehicleTooltip } from "../utils/format";
import { interpolateLatLng } from "../utils/interpolate";
import { createVehicleIcon } from "../utils/marker-icon";

/**
 * Renders nothing itself — it manages raw Leaflet markers imperatively on
 * the map instance from `useMap()`. This is deliberate: with ~200 vehicles
 * animating every frame, representing each as a React-managed `<Marker>`
 * and updating its position via state would mean ~200 re-renders on every
 * animation tick. Instead, position updates (every `POLL_INTERVAL_MS`, when
 * new data lands) and per-frame interpolation (every ~16ms, via
 * requestAnimationFrame) both call Leaflet's own `setLatLng` directly,
 * never touching React state. See
 * docs/decisions/0006-realtime-map-rendering.md.
 */
export const VehicleMarkersLayer = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}: {
  vehicles: Vehicle[];
  selectedVehicleId: VehicleId | null;
  onSelectVehicle: (id: VehicleId) => void;
}) => {
  const map = useMap();
  const markersRef = useRef<Map<VehicleId, TrackedMarker>>(new Map());
  const vehiclesRef = useRef<Vehicle[]>(vehicles);
  const onSelectRef = useRef(onSelectVehicle);
  useEffect(() => {
    onSelectRef.current = onSelectVehicle;
  });

  // Reconcile markers against the latest snapshot: add new vehicles, retarget
  // existing ones (animating from wherever they currently are, not from
  // their last target, so a late-arriving update never causes a jump), and
  // remove vehicles no longer being reported.
  useEffect(() => {
    const tracked = markersRef.current;
    const seen = new Set<VehicleId>();
    const now = performance.now();

    for (const vehicle of vehicles) {
      seen.add(vehicle.id);
      const existing = tracked.get(vehicle.id);

      if (!existing) {
        const marker = L.marker([vehicle.lat, vehicle.lon], {
          icon: createVehicleIcon(
            vehicle.direction,
            vehicle.vehicleType,
            vehicle.id === selectedVehicleId,
          ),
          // Keyboard access to vehicles is via the list panel, not 200
          // individual map tab-stops — see
          // docs/decisions/0006-realtime-map-rendering.md.
          keyboard: false,
        })
          .addTo(map)
          .on("click", () => onSelectRef.current(vehicle.id));
        marker.bindTooltip(formatVehicleTooltip(vehicle));
        tracked.set(vehicle.id, {
          marker,
          from: { lat: vehicle.lat, lon: vehicle.lon },
          to: { lat: vehicle.lat, lon: vehicle.lon },
          fromTime: now,
          toTime: now,
          currentLat: vehicle.lat,
          currentLon: vehicle.lon,
        });
        continue;
      }

      existing.from = { lat: existing.currentLat, lon: existing.currentLon };
      existing.to = { lat: vehicle.lat, lon: vehicle.lon };
      existing.fromTime = now;
      existing.toTime = now + POLL_INTERVAL_MS;
      existing.marker.setIcon(
        createVehicleIcon(
          vehicle.direction,
          vehicle.vehicleType,
          vehicle.id === selectedVehicleId,
        ),
      );
      existing.marker.setTooltipContent(formatVehicleTooltip(vehicle));
    }

    for (const [id, entry] of tracked) {
      if (!seen.has(id)) {
        entry.marker.remove();
        tracked.delete(id);
      }
    }

    vehiclesRef.current = vehicles;
  }, [vehicles, map, selectedVehicleId]);

  // Re-skin the selected marker immediately on selection, without waiting
  // for the next poll to redraw icons.
  useEffect(() => {
    for (const [id, entry] of markersRef.current) {
      const vehicle = vehiclesRef.current.find((v) => v.id === id);
      entry.marker.setIcon(
        createVehicleIcon(
          vehicle?.direction ?? 0,
          vehicle?.vehicleType ?? "other",
          id === selectedVehicleId,
        ),
      );
    }
  }, [selectedVehicleId]);

  useEffect(() => {
    let frame: number;
    const tick = () => {
      const now = performance.now();
      for (const entry of markersRef.current.values()) {
        const span = entry.toTime - entry.fromTime;
        const t = span <= 0 ? 1 : (now - entry.fromTime) / span;
        const pos = interpolateLatLng(entry.from, entry.to, t);
        entry.currentLat = pos.lat;
        entry.currentLon = pos.lon;
        entry.marker.setLatLng([pos.lat, pos.lon]);
      }
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

  return null;
};
