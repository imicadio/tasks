"use client";

import { useState } from "react";
import { useHydroFilters } from "../hooks/use-hydro-filters";
import { useStationList } from "../hooks/use-station-list";
import type { HydroPageData, HydroStationsParams } from "../types";
import { FiltersBar } from "./_internal/filters-bar";
import { StationList } from "./_internal/station-list";
import { StatusKpiTiles } from "./_internal/status-kpi-tiles";

type Props = HydroPageData & {
  initialParams: HydroStationsParams;
};

/**
 * State lives in three tiers (docs/decisions/0002-state-architecture.md):
 * filters in the URL (useHydroFilters), the station list in React Query
 * (useStationList), favorites in a persisted store, and view-only toggles
 * in local state.
 */
export const HydroMonitorDashboard = ({
  initialParams,
  initialData,
  voivodeships,
  statusCounts,
}: Props) => {
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const filters = useHydroFilters(initialParams);
  const { stations, visibleStations, isFetching, isError } = useStationList({
    params: filters.params,
    initialParams,
    initialData,
    onlyFavorites,
  });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">
          Monitoring hydrologiczny
        </h1>
        <p className="text-sm text-muted-foreground">
          Źródło: dane publiczne IMGW-PIB (danepubliczne.imgw.pl/api/data/hydro),{" "}
          {stations.length > 0 ? "aktualizowane na żywo" : "ładowanie…"}.
        </p>
      </header>

      <StatusKpiTiles
        counts={statusCounts}
        activeStatus={filters.params.status}
        onSelect={filters.toggleStatus}
      />

      <FiltersBar
        filters={filters}
        voivodeships={voivodeships}
        onlyFavorites={onlyFavorites}
        onOnlyFavoritesChange={setOnlyFavorites}
        isFetching={isFetching}
        isError={isError}
      />

      <StationList stations={visibleStations} />
    </div>
  );
};
