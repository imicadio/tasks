import { EMPTY_STATUS_COUNTS } from "../constants";
import type { HydroStation, StatusCounts } from "../types";

/** How many stations are in each status. */
export function countByStatus(stations: HydroStation[]): StatusCounts {
  const counts = { ...EMPTY_STATUS_COUNTS };
  for (const station of stations) counts[station.status] += 1;
  return counts;
}
