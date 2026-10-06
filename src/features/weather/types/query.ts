import type { WeatherStation } from "./station";

export type WeatherSortField = "name" | "temperatureC" | "windSpeedMs";
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
