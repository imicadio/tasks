import type { StationStatus } from "../types";

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
