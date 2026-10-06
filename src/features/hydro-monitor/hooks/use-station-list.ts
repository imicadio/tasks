"use client";

import { useMemo } from "react";
import { shallowEqual } from "@/shared/utils/shallow-equal";
import { useFavoriteStations } from "../store";
import type { HydroStationsParams, HydroStationsResponse } from "../types";
import { useHydroStations } from "./use-hydro-stations";

type Options = {
  params: HydroStationsParams;
  initialParams: HydroStationsParams;
  initialData: HydroStationsResponse;
  onlyFavorites: boolean;
};

/** The stations to show: fetched for the current filters (falling back to
 * the server-rendered list until the first fetch lands), optionally
 * narrowed to the viewer's favorites. */
export function useStationList({
  params,
  initialParams,
  initialData,
  onlyFavorites,
}: Options) {
  const { data, isFetching, isError } = useHydroStations(params);
  const favoriteIds = useFavoriteStations((state) => state.favoriteIds);

  const fallback = shallowEqual(params, initialParams) ? initialData.data : [];
  const stations = data?.data ?? fallback;

  const visibleStations = useMemo(() => {
    if (!onlyFavorites) return stations;
    const favorites = new Set(favoriteIds);
    return stations.filter((station) => favorites.has(station.id));
  }, [stations, onlyFavorites, favoriteIds]);

  return { stations, visibleStations, isFetching, isError };
}
