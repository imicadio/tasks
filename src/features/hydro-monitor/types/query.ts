import type { HydroStation, StationStatus } from "./station";

export type StatusFilter = StationStatus | "all";

export type SortField = "name" | "waterLevelCm" | "status";
import type { SortDirection } from "@/shared/types/sort";

export type { SortDirection };

/** Filters and sort order of the station list — mirrors `hydroQuerySchema`. */
export type HydroStationsParams = {
  q: string;
  status: StatusFilter;
  voivodeship: string;
  sort: SortField;
  dir: SortDirection;
};

/** `GET /api/hydro-monitor` response body. */
export type HydroStationsResponse = { data: HydroStation[]; total: number };
