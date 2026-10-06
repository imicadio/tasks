import {
  CATEGORY_LABELS,
  DATE_TIME_FORMAT,
  MISSING_VALUE,
  SEVERITY_LABELS,
} from "../constants";
import type { Incident } from "../types";

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? MISSING_VALUE : DATE_TIME_FORMAT.format(date);
}

export function formatCoords(lat: number, lon: number): string {
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}

/** "ZGL-20261005-0427" — date of reporting plus 4 random digits. */
export function createReference(now: Date, random: number = Math.random()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const suffix = String(Math.floor(random * 10_000)).padStart(4, "0");
  return `ZGL-${y}${m}${d}-${suffix}`;
}

/** `<input type="datetime-local">` max value for "now" in local time. */
export function toDateTimeLocal(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

/** "Zagrożenie drogowe · zagrożenie wysoki" — category and severity line. */
export function formatIncidentMeta(incident: Pick<Incident, "category" | "severity">): string {
  return `${CATEGORY_LABELS[incident.category]} · zagrożenie ${SEVERITY_LABELS[incident.severity].toLowerCase()}`;
}
