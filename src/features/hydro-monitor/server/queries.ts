import "server-only";
import { IMGW_HYDRO_URL, STATUS_ORDER } from "../constants";
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
    if (status !== "all" && station.status !== status) return false;
    if (voivodeship !== "all" && station.voivodeship !== voivodeship) {
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
      case "name":
        comparison = a.name.localeCompare(b.name, "pl");
        break;
      case "waterLevelCm":
        comparison =
          (a.waterLevelCm ?? -Infinity) - (b.waterLevelCm ?? -Infinity);
        break;
      case "status":
        comparison =
          (statusRank.get(a.status) ?? 0) - (statusRank.get(b.status) ?? 0);
        break;
      default: {
        const exhaustive: never = sort;
        throw new Error(`Unhandled sort field: ${exhaustive}`);
      }
    }
    return dir === "asc" ? comparison : -comparison;
  });

  return sorted;
}
