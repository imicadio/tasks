import { degreesToCompass } from "@/shared/utils/compass";
import { MISSING_VALUE } from "../constants";
import type { WeatherStation } from "../types";

/** `value` followed by `unit` (include any leading space in `unit`), or a
 * dash when IMGW didn't report it. */
export function formatWithUnit(value: number | null, unit: string): string {
  return value === null ? MISSING_VALUE : `${value}${unit}`;
}

export function formatTemp(value: number | null): string {
  return value === null ? MISSING_VALUE : `${value.toFixed(1)} °C`;
}

/** IMGW's hour label ("12") as a clock time ("12:00"). */
export function formatMeasurementHour(hour: string | null): string {
  return hour === null ? MISSING_VALUE : `${hour}:00`;
}

/** Degrees plus the 16-point compass label, e.g. "225° (SW)". */
export function formatWindDirection(degrees: number | null): string {
  if (degrees === null) return MISSING_VALUE;
  return `${degrees}° (${degreesToCompass(degrees)})`;
}

/** "21.4 °C — Kraków" for the warmest/coldest tiles. */
export function formatTempAtStation(station: WeatherStation | null): string {
  if (!station) return MISSING_VALUE;
  return `${formatTemp(station.temperatureC)} — ${station.name}`;
}
