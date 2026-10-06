"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { DIR_LABELS, SEARCH_DEBOUNCE_MS, SORT_LABELS } from "../constants";
import { useWeatherStations } from "../hooks/use-weather-stations";
import type {
  SortDirection,
  WeatherPageData,
  WeatherSortField,
  WeatherStationsParams,
} from "../types";
import { formatTemp, formatWithUnit } from "../utils/format";
import { SummaryTiles } from "./_internal/summary-tiles";

type Props = WeatherPageData & {
  initialParams: WeatherStationsParams;
};

export const WeatherDashboard = ({ initialParams, initialData, summary }: Props) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(initialParams.q);
  const [sort, setSort] = useUrlState<WeatherSortField>(
    "sort",
    initialParams.sort,
  );
  const [dir, setDir] = useUrlState<SortDirection>("dir", initialParams.dir);
  const [q, setQ] = useUrlState("q", initialParams.q);

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
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

      <SummaryTiles summary={summary} />

      <Card className="flex flex-wrap items-center gap-3">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Szukaj stacji…"
          aria-label="Szukaj stacji pogodowej"
          className="max-w-xs"
        />
        <Select value={sort} onValueChange={(v) => v && setSort(v as WeatherSortField)}>
          <SelectTrigger aria-label="Sortuj wyniki według" className="w-48">
            <SelectValue>{(v: WeatherSortField) => SORT_LABELS[v]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="temperatureC">{SORT_LABELS.temperatureC}</SelectItem>
            <SelectItem value="windSpeedMs">{SORT_LABELS.windSpeedMs}</SelectItem>
            <SelectItem value="name">{SORT_LABELS.name}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dir} onValueChange={(v) => v && setDir(v as SortDirection)}>
          <SelectTrigger aria-label="Kierunek sortowania" className="w-36">
            <SelectValue>{(v: SortDirection) => DIR_LABELS[v]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">{DIR_LABELS.desc}</SelectItem>
            <SelectItem value="asc">{DIR_LABELS.asc}</SelectItem>
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
          <caption className="sr-only">
            Stacje pogodowe, {stations.length} wyników
          </caption>
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th scope="col" className="py-1.5 font-medium">
                Stacja
              </th>
              <th scope="col" className="py-1.5 text-right font-medium">
                Temperatura
              </th>
              <th scope="col" className="py-1.5 text-right font-medium">
                Wiatr
              </th>
              <th scope="col" className="py-1.5 text-right font-medium">
                Wilgotność
              </th>
              <th scope="col" className="py-1.5 text-right font-medium">
                Ciśnienie
              </th>
            </tr>
          </thead>
          <tbody>
            {stations.map((s) => (
              <tr
                key={s.id}
                onClick={() => router.push(`/pogoda/${s.id}`)}
                className="cursor-pointer border-b border-border/60 hover:bg-accent"
              >
                <td className="py-1.5 text-foreground">
                  <Link
                    href={`/pogoda/${s.id}`}
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {s.name}
                  </Link>
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {formatTemp(s.temperatureC)}
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {formatWithUnit(s.windSpeedMs, " m/s")}
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {formatWithUnit(s.humidityPct, "%")}
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {formatWithUnit(s.pressureHpa, " hPa")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
