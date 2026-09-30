import type { StationStatus } from "./types";

// IMGW ("Instytut Meteorologii i Gospodarki Wodnej – PIB")
// public data API. No API key required; see
// https://danepubliczne.imgw.pl/pl/apiinfo. Attribution is required by
// IMGW's terms — see the footer note rendered in the dashboard component.
export const IMGW_HYDRO_URL = "https://danepubliczne.imgw.pl/api/data/hydro";

export const STATUS_LABELS = {
  alarm: "Alarmowy",
  warning: "Ostrzegawczy",
  normal: "Normalny",
  unknown: "Brak danych",
} as const satisfies Record<StationStatus, string>;

export const STATUS_COLORS = {
  alarm: "var(--status-critical)",
  warning: "var(--status-warning)",
  normal: "var(--status-good)",
  unknown: "var(--chart-muted)",
} as const satisfies Record<StationStatus, string>;

// alarm first: this is the order both the status filter dropdown and the
// default "most urgent first" sort use.
export const STATUS_ORDER = [
  "alarm",
  "warning",
  "unknown",
  "normal",
] as const satisfies readonly StationStatus[];
