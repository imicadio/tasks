import "server-only";
import {
  ALL_FILTER,
  IMGW_HYDRO_URL,
  SORT_DIRECTION,
  SORT_FIELD,
  STATUS_FILTER,
  STATUS_ORDER,
} from "../constants";
import { hydroStationsResponseSchema } from "../schemas";
import type { HydroStation, HydroStationsParams } from "../types";

export async function getHydroStations(): Promise<HydroStation[]> {
  const response = await fetch(IMGW_HYDRO_URL, { next: { revalidate: 300 } });

  if (!response.ok) {
    throw new Error(
      `IMGW hydro request failed: ${response.status} ${response.statusText}`,
    );
  }

  return hydroStationsResponseSchema.parse(await response.json());
}

export function filterAndSortStations(
  stations: HydroStation[],
  options: HydroStationsParams,
): HydroStation[] {
  const { q, status, voivodeship, sort, dir } = options;
  const needle = q.toLowerCase();

  const filtered = stations.filter((station) => {
    if (status !== STATUS_FILTER.All && station.status !== status) return false;
    if (voivodeship !== ALL_FILTER && station.voivodeship !== voivodeship) {
      return false;
    }
    if (
      needle &&
      !`${station.name} ${station.river}`.toLowerCase().includes(needle)
    ) {
      return false;
    }
    return true;
  });

  const statusRank = new Map(
    STATUS_ORDER.map((s, index) => [s, index] as const),
  );

  const sorted = [...filtered].sort((a, b) => {
    let comparison: number;
    switch (sort) {
      case SORT_FIELD.Name:
        comparison = a.name.localeCompare(b.name, "pl");
        break;
      case SORT_FIELD.WaterLevel:
        comparison =
          (a.waterLevelCm ?? -Infinity) - (b.waterLevelCm ?? -Infinity);
        break;
      case SORT_FIELD.Status:
        comparison =
          (statusRank.get(a.status) ?? 0) - (statusRank.get(b.status) ?? 0);
        break;
      default: {
        const exhaustive: never = sort;
        throw new Error(`Unhandled sort field: ${exhaustive}`);
      }
    }
    return dir === SORT_DIRECTION.Asc ? comparison : -comparison;
  });

  return sorted;
}
