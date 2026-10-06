import type { HydroStationsParams, HydroStationsResponse } from "../types";

/** Client-side fetch of the filtered station list from our validated proxy. */
export async function fetchHydroStations(
  params: HydroStationsParams,
): Promise<HydroStationsResponse> {
  const search = new URLSearchParams(params);
  const response = await fetch(`/api/hydro-monitor?${search.toString()}`);
  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych hydrologicznych.");
  }
  return response.json();
}
