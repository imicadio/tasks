"use client";

import { shallowEqual } from "@/shared/utils/shallow-equal";
import type { WeatherStationsParams, WeatherStationsResponse } from "../types";
import { useWeatherStations } from "./use-weather-stations";

type Options = {
  params: WeatherStationsParams;
  initialParams: WeatherStationsParams;
  initialData: WeatherStationsResponse;
};

/** Stations for the current search/sort, falling back to the
 * server-rendered list until the first fetch lands. */
export function useStationList({ params, initialParams, initialData }: Options) {
  const { data, isFetching, isError } = useWeatherStations(params);
  const fallback = shallowEqual(params, initialParams) ? initialData.data : [];
  return { stations: data?.data ?? fallback, isFetching, isError };
}
