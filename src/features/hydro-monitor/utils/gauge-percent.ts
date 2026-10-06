import type { HydroStation } from "../types";

/** How full the station's gauge bar is: the water level as a percentage of
 * the alarm level (or warning level when there's no alarm level), capped
 * at 100. `null` when there's no reading or no threshold to compare to. */
export function gaugePercent(station: HydroStation): number | null {
  const max = station.alarmLevelCm ?? station.warningLevelCm ?? null;
  if (!max || station.waterLevelCm === null) return null;
  return Math.min(100, Math.round((station.waterLevelCm / max) * 100));
}
