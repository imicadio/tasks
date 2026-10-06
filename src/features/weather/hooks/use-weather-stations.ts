"use client";

import { useQuery } from "@tanstack/react-query";
import type { WeatherStationsParams } from "../types";
import { fetchWeatherStations } from "../utils/fetch-weather-stations";

export function useWeatherStations(params: WeatherStationsParams) {
  return useQuery({
    queryKey: ["weather", params],
    queryFn: () => fetchWeatherStations(params),
    staleTime: 60_000,
    refetchInterval: 10 * 60_000,
  });
}
