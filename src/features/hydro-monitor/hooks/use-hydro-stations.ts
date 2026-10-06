"use client";

import { useQuery } from "@tanstack/react-query";
import type { HydroStationsParams } from "../types";
import { fetchHydroStations } from "../utils/fetch-hydro-stations";

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
