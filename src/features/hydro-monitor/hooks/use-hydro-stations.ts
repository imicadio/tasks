"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  HydroStation,
  SortDirection,
  SortField,
  StatusFilter,
} from "../types";

export type HydroStationsParams = {
  q: string;
  status: StatusFilter;
  voivodeship: string;
  sort: SortField;
  dir: SortDirection;
};

type HydroStationsResponse = { data: HydroStation[]; total: number };

async function fetchHydroStations(
  params: HydroStationsParams,
): Promise<HydroStationsResponse> {
  const search = new URLSearchParams(params);
  const response = await fetch(`/api/hydro-monitor?${search.toString()}`);
  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych hydrologicznych.");
  }
  return response.json();
}

/**
 * Server state: owned by IMGW, fetched through our own validated proxy,
 * cached and kept fresh by React Query rather than hand-rolled
 * fetch+useState+useEffect. See docs/decisions/0002-state-architecture.md.
 */
export function useHydroStations(params: HydroStationsParams) {
  return useQuery({
    queryKey: ["hydro-monitor", params],
    queryFn: () => fetchHydroStations(params),
    staleTime: 60_000,
    // IMGW's hydro feed itself refreshes roughly every 10-15 minutes.
    refetchInterval: 5 * 60_000,
  });
}
