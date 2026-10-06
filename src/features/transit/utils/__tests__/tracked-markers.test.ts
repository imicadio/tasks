import L from "leaflet";
import { describe, expect, it, vi } from "vitest";
import type { TrackedMarker, Vehicle, VehicleId } from "../../types";
import {
  addTrackedMarker,
  advanceMarker,
  removeStaleMarkers,
  retargetMarker,
} from "../tracked-markers";

const vehicle = (id: number, lat: number, lon: number) =>
  ({
    id: id as VehicleId,
    lat,
    lon,
    direction: 90,
    vehicleType: "bus",
    routeShortName: "148",
    headsign: "Wrzeszcz",
  }) as Vehicle;

function setup() {
  const map = L.map(document.createElement("div"));
  return addTrackedMarker(map, vehicle(1, 54, 18), false, vi.fn(), 0);
}

describe("tracked markers", () => {
  it("starts a new marker parked at its position", () => {
    const entry = setup();
    expect(entry.from).toEqual({ lat: 54, lon: 18 });
    expect(entry.to).toEqual({ lat: 54, lon: 18 });
  });

  it("animates from the current position to the new one", () => {
    const entry = setup();
    retargetMarker(entry, vehicle(1, 55, 19), false, 1000);
    advanceMarker(entry, 1000 + (entry.toTime - 1000) / 2);
    expect(entry.currentLat).toBeCloseTo(54.5);
    expect(entry.currentLon).toBeCloseTo(18.5);
  });

  it("removes markers of vehicles no longer reported", () => {
    const entry = setup();
    const tracked = new Map<VehicleId, TrackedMarker>([[1 as VehicleId, entry]]);
    removeStaleMarkers(tracked, new Set());
    expect(tracked.size).toBe(0);
  });
});
