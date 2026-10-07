import { VEHICLE_TYPE } from "../constants";
import type { Vehicle, VehicleType } from "../types";

/** Sets each vehicle's type from the routeId → type map, falling back to
 * "other" for a route the map doesn't know. */
export function applyVehicleTypes(
  vehicles: Vehicle[],
  routeTypes: Map<number, VehicleType>,
): Vehicle[] {
  return vehicles.map((vehicle) => ({
    ...vehicle,
    vehicleType: routeTypes.get(vehicle.routeId) ?? VEHICLE_TYPE.Other,
  }));
}

/** Vehicles whose route number contains `route` (case-insensitive); all of
 * them when `route` is empty. */
export function filterByRoute(vehicles: Vehicle[], route: string): Vehicle[] {
  if (!route) return vehicles;
  const needle = route.trim().toLowerCase();
  return vehicles.filter((v) =>
    v.routeShortName.toLowerCase().includes(needle),
  );
}

/** How many distinct routes the vehicles are running on. */
export function countRoutes(vehicles: Vehicle[]): number {
  return new Set(vehicles.map((v) => v.routeShortName)).size;
}

/** Mean delay in whole seconds (negative = ahead of schedule); 0 when there
 * are no vehicles. */
export function averageDelaySeconds(vehicles: Vehicle[]): number {
  if (vehicles.length === 0) return 0;
  const total = vehicles.reduce((sum, v) => sum + v.delaySeconds, 0);
  return Math.round(total / vehicles.length);
}

/** Legend entries to show: "other" is a real, handled case but doesn't
 * currently occur in practice, so it's listed only when a vehicle actually
 * has that type rather than as a permanently empty category. */
export function visibleVehicleTypes(
  types: VehicleType[],
  vehicles: Vehicle[],
): VehicleType[] {
  return types.filter(
    (type) => type !== VEHICLE_TYPE.Other || vehicles.some((v) => v.vehicleType === type),
  );
}
