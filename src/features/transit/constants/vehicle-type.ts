import type { VehicleType } from "../types";

export const VEHICLE_TYPE_LABELS = {
  bus: "Autobus",
  tram: "Tramwaj",
  other: "Inny",
} as const satisfies Record<VehicleType, string>;

// CSS custom property name per type — consumed by both the map markers
// (globals.css's .transit-marker--{type} classes) and the list/legend's
// inline dot indicators, so there's one source of truth for "which color
// means which vehicle type".
export const VEHICLE_TYPE_COLOR_VAR = {
  bus: "var(--transit-bus)",
  tram: "var(--transit-tram)",
  other: "var(--transit-other)",
} as const satisfies Record<VehicleType, string>;

/** Legend order. */
export const VEHICLE_TYPES: VehicleType[] = ["bus", "tram", "other"];
