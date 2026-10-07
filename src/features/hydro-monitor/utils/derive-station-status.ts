import { STATION_STATUS } from "../constants";
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
  if (waterLevelCm === null) return STATION_STATUS.Unknown;
  if (alarmLevelCm !== null && waterLevelCm >= alarmLevelCm) return STATION_STATUS.Alarm;
  if (warningLevelCm !== null && waterLevelCm >= warningLevelCm) {
    return STATION_STATUS.Warning;
  }
  return STATION_STATUS.Normal;
}
