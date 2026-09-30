"use client";

import { useEffect, useState } from "react";
import { useUrlState } from "@/shared/hooks/use-url-state";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useWeatherStations } from "../hooks/use-weather-stations";
import type { SortDirection, WeatherSortField, WeatherStation } from "../types";

type Summary = {
  avgTemperatureC: number | null;
  warmest: WeatherStation | null;
  coldest: WeatherStation | null;
  stationCount: number;
};

type Props = {
  initialParams: { q: string; sort: WeatherSortField; dir: SortDirection };
  initialData: { data: WeatherStation[]; total: number };
  summary: Summary;
};

function formatTemp(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(1)} °C`;
}

export function WeatherDashboard({ initialParams, initialData, summary }: Props) {
  const [searchInput, setSearchInput] = useState(initialParams.q);
  const [sort, setSort] = useUrlState<WeatherSortField>(
    "sort",
    initialParams.sort,
  );
  const [dir, setDir] = useUrlState<SortDirection>("dir", initialParams.dir);
  const [q, setQ] = useUrlState("q", initialParams.q);

  const debouncedSearch = useDebouncedValue(searchInput, 300);
  useEffect(() => {
    if (debouncedSearch !== q) setQ(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only q's setter should react to the debounced value
  }, [debouncedSearch]);

  const queryParams = { q, sort, dir };
  const isInitialParams =
    q === initialParams.q && sort === initialParams.sort && dir === initialParams.dir;
  const { data, isFetching, isError } = useWeatherStations(queryParams);
  const stations = data?.data ?? (isInitialParams ? initialData.data : []);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Pogoda</h1>
        <p className="text-sm text-muted-foreground">
          Źródło: dane publiczne IMGW-PIB (danepubliczne.imgw.pl/api/data/synop),{" "}
          {summary.stationCount} stacji synoptycznych.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            Średnia temperatura
          </span>
          <span className="text-3xl font-semibold tabular-nums text-primary">
            {formatTemp(summary.avgTemperatureC)}
          </span>
        </Card>
        <Card className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Najcieplej</span>
          <span className="text-2xl font-semibold tabular-nums text-foreground">
            {summary.warmest
              ? `${formatTemp(summary.warmest.temperatureC)} — ${summary.warmest.name}`
              : "—"}
          </span>
        </Card>
        <Card className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Najzimniej</span>
          <span className="text-2xl font-semibold tabular-nums text-foreground">
            {summary.coldest
              ? `${formatTemp(summary.coldest.temperatureC)} — ${summary.coldest.name}`
              : "—"}
          </span>
        </Card>
      </div>

      <Card className="flex flex-wrap items-center gap-3">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Szukaj stacji…"
          className="max-w-xs"
        />
        <Select value={sort} onValueChange={(v) => v && setSort(v as WeatherSortField)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="temperatureC">Sortuj: temperatura</SelectItem>
            <SelectItem value="windSpeedMs">Sortuj: wiatr</SelectItem>
            <SelectItem value="name">Sortuj: nazwa</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dir} onValueChange={(v) => v && setDir(v as SortDirection)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Malejąco</SelectItem>
            <SelectItem value="asc">Rosnąco</SelectItem>
          </SelectContent>
        </Select>
        {isFetching && (
          <span className="text-sm text-muted-foreground">Odświeżanie…</span>
        )}
        {isError && (
          <span className="text-sm text-destructive">
            Nie udało się pobrać danych.
          </span>
        )}
      </Card>

      <Card>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-1.5 font-medium">Stacja</th>
              <th className="py-1.5 text-right font-medium">Temperatura</th>
              <th className="py-1.5 text-right font-medium">Wiatr</th>
              <th className="py-1.5 text-right font-medium">Wilgotność</th>
              <th className="py-1.5 text-right font-medium">Ciśnienie</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((s) => (
              <tr key={s.id} className="border-b border-border/60">
                <td className="py-1.5 text-foreground">{s.name}</td>
                <td className="py-1.5 text-right tabular-nums">
                  {formatTemp(s.temperatureC)}
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {s.windSpeedMs === null ? "—" : `${s.windSpeedMs} m/s`}
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {s.humidityPct === null ? "—" : `${s.humidityPct}%`}
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {s.pressureHpa === null ? "—" : `${s.pressureHpa} hPa`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
