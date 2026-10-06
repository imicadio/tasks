import type { WeatherStationsResponse } from "./query";
import type { WeatherStation } from "./station";

/** Nationwide headline numbers shown above the station list. */
export type WeatherSummary = {
  avgTemperatureC: number | null;
  warmest: WeatherStation | null;
  coldest: WeatherStation | null;
  stationCount: number;
};

/** Everything the dashboard page needs for its first, server-side render. */
export type WeatherPageData = {
  initialData: WeatherStationsResponse;
  summary: WeatherSummary;
};
