import type { Vehicle } from "../types";

/** A single vehicle's delay: "na czas" within a minute, otherwise signed
 * whole minutes ("+3 min", "-2 min"). */
export function formatDelay(seconds: number): string {
  if (Math.abs(seconds) < 60) return "na czas";
  const minutes = Math.round(seconds / 60);
  return minutes > 0 ? `+${minutes} min` : `${minutes} min`;
}

/** The fleet-wide average for the KPI tile: always signed, in minutes. */
export function formatAverageDelay(seconds: number): string {
  const sign = seconds >= 0 ? "+" : "";
  return `${sign}${Math.round(seconds / 60)} min`;
}

/** Marker tooltip: "148 → Dworzec Główny". */
export function formatVehicleTooltip(vehicle: Vehicle): string {
  return `${vehicle.routeShortName} → ${vehicle.headsign || "?"}`;
}
