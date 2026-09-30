declare const stationIdBrand: unique symbol;
/** Branded so a raw string can't be passed where a validated station id is expected. */
export type StationId = string & { readonly [stationIdBrand]: true };

export function toStationId(rawId: number | string): StationId {
  return String(rawId) as StationId;
}

export type StationStatus = "alarm" | "warning" | "normal" | "unknown";

export type HydroStation = {
  id: StationId;
  name: string;
  river: string;
  voivodeship: string;
  lon: number;
  lat: number;
  waterLevelCm: number | null;
  warningLevelCm: number | null;
  alarmLevelCm: number | null;
  measuredAt: string | null;
  status: StationStatus;
};

/**
 * Derives the domain concept of "risk status" from three raw measurements
 * the API gives us — this is the anti-corruption layer: nothing downstream
 * of this function reasons about raw thresholds again, only about
 * `StationStatus`. See docs/decisions/0003-api-data-validation.md.
 */
export function deriveStationStatus(
  waterLevelCm: number | null,
  warningLevelCm: number | null,
  alarmLevelCm: number | null,
): StationStatus {
  if (waterLevelCm === null) return "unknown";
  if (alarmLevelCm !== null && waterLevelCm >= alarmLevelCm) return "alarm";
  if (warningLevelCm !== null && waterLevelCm >= warningLevelCm) {
    return "warning";
  }
  return "normal";
}

export type StatusFilter = StationStatus | "all";

export type SortField = "name" | "waterLevelCm" | "status";
export type SortDirection = "asc" | "desc";
