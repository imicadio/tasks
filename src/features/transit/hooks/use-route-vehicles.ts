"use client";

import { useMemo } from "react";
import { useDebouncedUrlParam } from "@/shared/hooks/use-debounced-url-param";
import { SEARCH_DEBOUNCE_MS } from "../constants";
import type { VehiclesSnapshot } from "../types";
import { useVehiclePositions } from "./use-vehicle-positions";

/**
 * The route filter (in the URL as `route`, matching `transitQuerySchema`,
 * which the page uses for SSR) and the live vehicles on it — falling back
 * to the server-rendered snapshot until the first poll lands.
 */
export function useRouteVehicles(initialRoute: string, initialSnapshot: VehiclesSnapshot) {
  const search = useDebouncedUrlParam("route", initialRoute, SEARCH_DEBOUNCE_MS);
  const { data, isError } = useVehiclePositions(search.value);

  const fallback = search.value === initialRoute ? initialSnapshot : null;
  const snapshot = data ?? fallback;
  const vehicles = useMemo(() => snapshot?.vehicles ?? [], [snapshot]);

  return {
    vehicles,
    isError,
    searchInput: search.input,
    handleSearchChange: search.handleInputChange,
  };
}
