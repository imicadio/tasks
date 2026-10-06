import "server-only";
import {
  GPS_REVALIDATE_S,
  TRISTAR_GPS_URL,
  TRISTAR_ROUTES_URL,
} from "../constants";
import { routeTypeMapSchema, vehiclesSnapshotSchema } from "../schemas";
import type { VehicleType, VehiclesSnapshot } from "../types";
import { applyVehicleTypes, filterByRoute } from "../utils/vehicles";

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
    // Live positions, cached for only a few seconds: the source refreshes
    // each vehicle every ~20s anyway, and sharing one upstream read across
    // every viewer keeps page loads from waiting on Tristar each time —
    // see GPS_REVALIDATE_S.
    fetch(TRISTAR_GPS_URL, { next: { revalidate: GPS_REVALIDATE_S } }),
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

/** The current snapshot narrowed to vehicles on routes matching `route`
 * (see `filterByRoute`); the whole fleet when `route` is empty. */
export async function getVehiclesByRoute(
  route: string,
): Promise<VehiclesSnapshot> {
  const snapshot = await getVehiclePositions();
  return {
    lastUpdate: snapshot.lastUpdate,
    vehicles: filterByRoute(snapshot.vehicles, route),
  };
}
