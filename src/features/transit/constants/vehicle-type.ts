import type { RouteType, VehicleType } from "../types";

export const VEHICLE_TYPE = {
  Bus: "bus",
  Tram: "tram",
  Other: "other",
} as const;

/** `routeType` values in ZTM Gdańsk's routes feed. Anything else maps to
 * VEHICLE_TYPE.Other. */
export const ROUTE_TYPE = {
  Bus: "BUS",
  Tram: "TRAM",
} as const;

export const ROUTE_TYPE_TO_VEHICLE_TYPE: Record<RouteType, VehicleType> = {
  [ROUTE_TYPE.Bus]: VEHICLE_TYPE.Bus,
  [ROUTE_TYPE.Tram]: VEHICLE_TYPE.Tram,
};

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  [VEHICLE_TYPE.Bus]: "Autobus",
  [VEHICLE_TYPE.Tram]: "Tramwaj",
  [VEHICLE_TYPE.Other]: "Inny",
};

// CSS custom property name per type — consumed by both the map markers
// (globals.css's .transit-marker--{type} classes) and the list/legend's
// inline dot indicators, so there's one source of truth for "which color
// means which vehicle type".
export const VEHICLE_TYPE_COLOR_VAR: Record<VehicleType, string> = {
  [VEHICLE_TYPE.Bus]: "var(--transit-bus)",
  [VEHICLE_TYPE.Tram]: "var(--transit-tram)",
  [VEHICLE_TYPE.Other]: "var(--transit-other)",
};

/** Legend order. */
export const VEHICLE_TYPES: VehicleType[] = Object.values(VEHICLE_TYPE);
