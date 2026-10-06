import type { AvailabilityStatus } from "../types";

export const AVAILABILITY_LABELS = {
  available: "Wolne miejsca",
  few: "Mało miejsc",
  full: "Brak miejsc",
  unknown: "Brak danych",
} as const satisfies Record<AvailabilityStatus, string>;

// Color only reinforces the status — the free-spot count and the status
// label are always shown as text too (WCAG 1.4.1).
export const AVAILABILITY_COLOR_VAR = {
  available: "var(--status-good)",
  few: "var(--status-warning)",
  full: "var(--status-critical)",
  unknown: "var(--chart-muted)",
} as const satisfies Record<AvailabilityStatus, string>;

/** Legend order. */
export const AVAILABILITY_STATUSES: AvailabilityStatus[] = [
  "available",
  "few",
  "full",
  "unknown",
];
