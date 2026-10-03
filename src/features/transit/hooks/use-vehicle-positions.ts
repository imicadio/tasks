"use client";

import { useQuery } from "@tanstack/react-query";
import { POLL_INTERVAL_MS } from "../constants";
import type { VehiclesSnapshot } from "../types";

async function fetchVehiclePositions(route: string): Promise<VehiclesSnapshot> {
  const search = new URLSearchParams(route ? { route } : {});
  const response = await fetch(`/api/transit?${search.toString()}`);
  if (!response.ok) {
    throw new Error("Nie udało się pobrać pozycji pojazdów.");
  }
  return response.json();
}

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
