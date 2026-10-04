import type { AvailabilityStatus } from "./types";

// Gdańsk parking lots — ckan.multimediagdansk.pl. No API key required.

// Lot list (static-ish metadata: name, address, entrance, coordinates).
// Shape: { lastUpdate, parkingLots: [{ id, name, shortName, address,
// streetEntrance, location: { latitude, longitude } }] }
export const PARKING_LOTS_URL =
  "https://ckan.multimediagdansk.pl/dataset/cb1e2708-aec1-4b21-9c8c-db2626ae31a6/resource/d361dff3-202b-402d-92a5-445d8ba6fd7f/download/parking-lots.json";

// Live free-spot counts. ckan2 301-redirects here, so hit ckan3 directly.
// Shape: { lastUpdate, parkingLots: [{ parkingId, availableSpots, lastUpdate }] }
// `parkingId` matches `id` in PARKING_LOTS_URL.
export const PARKING_AVAILABILITY_URL =
  "https://ckan3.multimediagdansk.pl/parkingLots";

// The live feed is served with a 30s `Expires`, and individual lots report
// every 1-2 minutes (verified 2026-10-03), so polling faster than this
// would mostly return the same numbers.
export const POLL_INTERVAL_MS = 60_000;

// The feed reports free spots only, not capacity, so "few" is an absolute
// count rather than a percentage.
export const FEW_SPOTS_THRESHOLD = 20;

export const GDANSK_CENTER: [number, number] = [54.372, 18.6386];
export const DEFAULT_ZOOM = 12;

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
