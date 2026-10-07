import type { AvailabilityStatus } from "../types";

export const AVAILABILITY_STATUS = {
  Available: "available",
  Few: "few",
  Full: "full",
  /** Only when the live feed has no entry for a lot at all. */
  Unknown: "unknown",
} as const;

export const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  [AVAILABILITY_STATUS.Available]: "Wolne miejsca",
  [AVAILABILITY_STATUS.Few]: "Mało miejsc",
  [AVAILABILITY_STATUS.Full]: "Brak miejsc",
  [AVAILABILITY_STATUS.Unknown]: "Brak danych",
};

// Color only reinforces the status — the free-spot count and the status
// label are always shown as text too (WCAG 1.4.1).
export const AVAILABILITY_COLOR_VAR: Record<AvailabilityStatus, string> = {
  [AVAILABILITY_STATUS.Available]: "var(--status-good)",
  [AVAILABILITY_STATUS.Few]: "var(--status-warning)",
  [AVAILABILITY_STATUS.Full]: "var(--status-critical)",
  [AVAILABILITY_STATUS.Unknown]: "var(--chart-muted)",
};

/** Legend order. */
export const AVAILABILITY_STATUSES: AvailabilityStatus[] = Object.values(AVAILABILITY_STATUS);
