import type { ValueOf } from "@/shared/types/value-of";
import type { SORT_FIELD, STATUS_FILTER } from "../constants";
import type { HydroStation } from "./station";

export type StatusFilter = ValueOf<typeof STATUS_FILTER>;

export type SortField = ValueOf<typeof SORT_FIELD>;
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
