"use client";

import { useQuery } from "@tanstack/react-query";
import type { SortDirection, WeatherSortField, WeatherStation } from "../types";

export type WeatherStationsParams = {
  q: string;
  sort: WeatherSortField;
  dir: SortDirection;
};

async function fetchWeatherStations(
  params: WeatherStationsParams,
): Promise<{ data: WeatherStation[]; total: number }> {
  const search = new URLSearchParams(params);
  const response = await fetch(`/api/weather?${search.toString()}`);
  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych pogodowych.");
  }
  return response.json();
}

export function useWeatherStations(params: WeatherStationsParams) {
  return useQuery({
    queryKey: ["weather", params],
    queryFn: () => fetchWeatherStations(params),
    staleTime: 60_000,
    refetchInterval: 10 * 60_000,
  });
}
