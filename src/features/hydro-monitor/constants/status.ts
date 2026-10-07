import type { StationStatus, StatusCounts, StatusFilter } from "../types";

export const STATION_STATUS = {
  Alarm: "alarm",
  Warning: "warning",
  Normal: "normal",
  Unknown: "unknown",
} as const;

/** The "no filter" option — shared by the status and voivodeship filters. */
export const ALL_FILTER = "all";

export const STATUS_FILTER = {
  All: ALL_FILTER,
  ...STATION_STATUS,
} as const;

export const STATUS_LABELS: Record<StationStatus, string> = {
  [STATION_STATUS.Alarm]: "Alarmowy",
  [STATION_STATUS.Warning]: "Ostrzegawczy",
  [STATION_STATUS.Normal]: "Normalny",
  [STATION_STATUS.Unknown]: "Brak danych",
};

export const STATUS_COLORS: Record<StationStatus, string> = {
  [STATION_STATUS.Alarm]: "var(--status-critical)",
  [STATION_STATUS.Warning]: "var(--status-warning)",
  [STATION_STATUS.Normal]: "var(--status-good)",
  [STATION_STATUS.Unknown]: "var(--chart-muted)",
};

// alarm first: this is the order both the status filter dropdown and the
// default "most urgent first" sort use.
export const STATUS_ORDER: StationStatus[] = [
  STATION_STATUS.Alarm,
  STATION_STATUS.Warning,
  STATION_STATUS.Unknown,
  STATION_STATUS.Normal,
];

/** Order of the KPI tiles above the list (severity, then "no data"). */
export const STATUS_KPI_ORDER: StationStatus[] = [
  STATION_STATUS.Alarm,
  STATION_STATUS.Warning,
  STATION_STATUS.Normal,
  STATION_STATUS.Unknown,
];

export const EMPTY_STATUS_COUNTS: StatusCounts = {
  [STATION_STATUS.Alarm]: 0,
  [STATION_STATUS.Warning]: 0,
  [STATION_STATUS.Normal]: 0,
  [STATION_STATUS.Unknown]: 0,
};

/** Status filter options, in dropdown order. */
export const STATUS_FILTERS: StatusFilter[] = [STATUS_FILTER.All, ...STATUS_KPI_ORDER];

export const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  [STATUS_FILTER.All]: "Wszystkie statusy",
  ...STATUS_LABELS,
};
