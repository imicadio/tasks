import type { ValueOf } from "@/shared/types/value-of";
import type { WEATHER_SORT_FIELD } from "../constants";
import type { WeatherStation } from "./station";

export type WeatherSortField = ValueOf<typeof WEATHER_SORT_FIELD>;
import type { SortDirection } from "@/shared/types/sort";

export type { SortDirection };

/** Search and sort order of the station list — mirrors `weatherQuerySchema`. */
export type WeatherStationsParams = {
  q: string;
  sort: WeatherSortField;
  dir: SortDirection;
};

/** `GET /api/weather` response body. */
export type WeatherStationsResponse = { data: WeatherStation[]; total: number };
