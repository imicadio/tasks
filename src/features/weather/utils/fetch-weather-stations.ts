import type { WeatherStationsParams, WeatherStationsResponse } from "../types";

/** Client-side fetch of the sorted station list from our validated proxy. */
export async function fetchWeatherStations(
  params: WeatherStationsParams,
): Promise<WeatherStationsResponse> {
  const search = new URLSearchParams(params);
  const response = await fetch(`/api/weather?${search.toString()}`);
  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych pogodowych.");
  }
  return response.json();
}
