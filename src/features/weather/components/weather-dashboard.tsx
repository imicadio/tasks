"use client";

import { useStationList } from "../hooks/use-station-list";
import { useWeatherFilters } from "../hooks/use-weather-filters";
import type { WeatherPageData, WeatherStationsParams } from "../types";
import { FiltersBar } from "./_internal/filters-bar";
import { StationsTable } from "./_internal/stations-table";
import { SummaryTiles } from "./_internal/summary-tiles";

type Props = WeatherPageData & {
  initialParams: WeatherStationsParams;
};

export const WeatherDashboard = ({ initialParams, initialData, summary }: Props) => {
  const filters = useWeatherFilters(initialParams);
  const { stations, isFetching, isError } = useStationList({
    params: filters.params,
    initialParams,
    initialData,
  });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Pogoda</h1>
        <p className="text-sm text-muted-foreground">
          Źródło: dane publiczne IMGW-PIB (danepubliczne.imgw.pl/api/data/synop),{" "}
          {summary.stationCount} stacji synoptycznych.
        </p>
      </header>

      <SummaryTiles summary={summary} />
      <FiltersBar filters={filters} isFetching={isFetching} isError={isError} />
      <StationsTable stations={stations} />
    </div>
  );
};
