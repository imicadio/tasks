import type { StationStatus, StatusCounts, StatusFilter } from "../types";

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

/** Order of the KPI tiles above the list (severity, then "no data"). */
export const STATUS_KPI_ORDER = [
  "alarm",
  "warning",
  "normal",
  "unknown",
] as const satisfies readonly StationStatus[];

export const EMPTY_STATUS_COUNTS: StatusCounts = {
  alarm: 0,
  warning: 0,
  normal: 0,
  unknown: 0,
};

export const STATUS_FILTERS: StatusFilter[] = [
  "all",
  "alarm",
  "warning",
  "normal",
  "unknown",
];

export const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  all: "Wszystkie statusy",
  ...STATUS_LABELS,
};
