"use client";

import { useQuery } from "@tanstack/react-query";
import { POLL_INTERVAL_MS } from "../constants";
import type { ParkingSnapshot } from "../types";
import { fetchParkingLots } from "../utils/fetch-parking-lots";

export function useParkingLots(initialData?: ParkingSnapshot) {
  return useQuery({
    queryKey: ["parking"],
    queryFn: fetchParkingLots,
    initialData,
    refetchInterval: POLL_INTERVAL_MS,
    // Matches the server's 30s upstream cache — refetching sooner (e.g. on
    // mount right after SSR) could only return the same numbers.
    staleTime: 30_000,
  });
}
