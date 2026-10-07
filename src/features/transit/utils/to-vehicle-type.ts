import { ROUTE_TYPE_TO_VEHICLE_TYPE, VEHICLE_TYPE } from "../constants";
import type { RouteType, VehicleType } from "../types";

function isRouteType(raw: string): raw is RouteType {
  return Object.hasOwn(ROUTE_TYPE_TO_VEHICLE_TYPE, raw);
}

/** Maps the routes feed's `routeType` ("BUS", "TRAM", …) to our vehicle
 * type; anything unrecognized is VEHICLE_TYPE.Other. */
export function toVehicleType(raw: string): VehicleType {
  return isRouteType(raw) ? ROUTE_TYPE_TO_VEHICLE_TYPE[raw] : VEHICLE_TYPE.Other;
}
