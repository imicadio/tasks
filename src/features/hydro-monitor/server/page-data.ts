import "server-only";
import type { HydroPageData, HydroStationsParams } from "../types";
import { countByStatus } from "../utils/count-by-status";
import { listVoivodeships } from "../utils/list-voivodeships";
import { filterAndSortStations, getHydroStations } from "./queries";

/** Data for the dashboard's first render: the station list filtered by the
 * URL's params, plus the filter options and per-status counts, which
 * always describe every station regardless of the active filters. */
export async function getHydroPageData(
  params: HydroStationsParams,
): Promise<HydroPageData> {
  const allStations = await getHydroStations();

  return {
    initialData: {
      data: filterAndSortStations(allStations, params),
      total: allStations.length,
    },
    voivodeships: listVoivodeships(allStations),
    statusCounts: countByStatus(allStations),
  };
}
