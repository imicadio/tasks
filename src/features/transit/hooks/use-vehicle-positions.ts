"use client";

import { useQuery } from "@tanstack/react-query";
import { POLL_INTERVAL_MS } from "../constants";
import { fetchVehiclePositions } from "../utils/fetch-vehicle-positions";

export function useVehiclePositions(route: string) {
  return useQuery({
    queryKey: ["transit", route],
    queryFn: () => fetchVehiclePositions(route),
    refetchInterval: POLL_INTERVAL_MS,
    // A stale GPS fix is actively misleading on a "real-time" map — don't
    // let React Query serve a cached snapshot instead of refetching.
    staleTime: 0,
  });
}
