import "server-only";
import type { WeatherPageData, WeatherStationsParams } from "../types";
import { summarizeWeather } from "../utils/summarize-weather";
import { filterAndSortWeatherStations, getWeatherStations } from "./queries";

/** Data for the dashboard's first render: the station list sorted by the
 * URL's params, plus the nationwide summary, which always covers every
 * station regardless of the search. */
export async function getWeatherPageData(
  params: WeatherStationsParams,
): Promise<WeatherPageData> {
  const allStations = await getWeatherStations();

  return {
    initialData: {
      data: filterAndSortWeatherStations(allStations, params),
      total: allStations.length,
    },
    summary: summarizeWeather(allStations),
  };
}
