import "server-only";
import { TRISTAR_GPS_URL, TRISTAR_ROUTES_URL } from "../constants";
import { routeTypeMapSchema, vehiclesSnapshotSchema } from "../schemas";
import type { Vehicle, VehicleType, VehiclesSnapshot } from "../types";

/**
 * routeId → vehicle type, from ZTM Gdańsk's own route list — not guessed
 * from the route number. Route assignments change at most daily, so unlike
 * the live GPS feed this is cached for an hour.
 */
export async function getRouteTypes(): Promise<Map<number, VehicleType>> {
  const response = await fetch(TRISTAR_ROUTES_URL, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `Tristar routes request failed: ${response.status} ${response.statusText}`,
    );
  }

  return routeTypeMapSchema.parse(await response.json());
}

export async function getVehiclePositions(): Promise<VehiclesSnapshot> {
  const [gpsResponse, routeTypes] = await Promise.all([
    // Live positions — caching this would defeat the point of a real-time
    // map, so no `next: { revalidate }` here (unlike every other feature's
    // queries, which fetch from much slower-moving sources, and unlike
    // getRouteTypes() above).
    fetch(TRISTAR_GPS_URL, { cache: "no-store" }),
    getRouteTypes(),
  ]);

  if (!gpsResponse.ok) {
    throw new Error(
      `Tristar GPS request failed: ${gpsResponse.status} ${gpsResponse.statusText}`,
    );
  }

  const snapshot = vehiclesSnapshotSchema.parse(await gpsResponse.json());

  return {
    lastUpdate: snapshot.lastUpdate,
    vehicles: applyVehicleTypes(snapshot.vehicles, routeTypes),
  };
}

/** Pulled out as a pure function purely so the join logic is testable
 * without mocking two HTTP requests. */
export function applyVehicleTypes(
  vehicles: Vehicle[],
  routeTypes: Map<number, VehicleType>,
): Vehicle[] {
  return vehicles.map((vehicle) => ({
    ...vehicle,
    vehicleType: routeTypes.get(vehicle.routeId) ?? "other",
  }));
}

export function filterByRoute(
  vehicles: Vehicle[],
  route: string,
): Vehicle[] {
  if (!route) return vehicles;
  const needle = route.trim().toLowerCase();
  return vehicles.filter((v) =>
    v.routeShortName.toLowerCase().includes(needle),
  );
}
