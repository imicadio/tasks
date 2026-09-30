"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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
import { Switch } from "@/shared/ui/switch";
import { STATUS_COLORS, STATUS_LABELS } from "../constants";
import { useFavoriteStations } from "../store";
import { useHydroStations } from "../hooks/use-hydro-stations";
import { StationRow, StationRowUnmemoized } from "./station-row";
import type {
  HydroStation,
  SortDirection,
  SortField,
  StationId,
  StationStatus,
  StatusFilter,
} from "../types";

const STATUS_FILTERS: StatusFilter[] = [
  "all",
  "alarm",
  "warning",
  "normal",
  "unknown",
];

const ROW_HEIGHT = 56;
const LIST_HEIGHT = 560;

type Props = {
  initialParams: {
    q: string;
    status: StatusFilter;
    voivodeship: string;
    sort: SortField;
    dir: SortDirection;
  };
  initialData: { data: HydroStation[]; total: number };
  voivodeships: string[];
  statusCounts: Record<StationStatus, number>;
};

export function HydroMonitorDashboard({
  initialParams,
  initialData,
  voivodeships,
  statusCounts,
}: Props) {
  // --- Local state: transient, UI-only, not worth sharing or persisting.
  const [searchInput, setSearchInput] = useState(initialParams.q);
  const [hoveredId, setHoveredId] = useState<StationId | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [perfMode, setPerfMode] = useState<"optimized" | "naive">(
    "optimized",
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- URL state: shareable/bookmarkable filters (the query itself).
  const [status, setStatus] = useUrlState<StatusFilter>(
    "status",
    initialParams.status,
  );
  const [voivodeship, setVoivodeship] = useUrlState(
    "wojewodztwo",
    initialParams.voivodeship,
  );
  const [sort, setSort] = useUrlState<SortField>("sort", initialParams.sort);
  const [dir, setDir] = useUrlState<SortDirection>("dir", initialParams.dir);
  const [q, setQ] = useUrlState("q", initialParams.q);

  const debouncedSearch = useDebouncedValue(searchInput, 300);
  useEffect(() => {
    if (debouncedSearch !== q) setQ(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only q's setter should react to the debounced value
  }, [debouncedSearch]);

  // --- Global state: pinned stations, shared across the filter bar and
  // every row, persisted across sessions — not server data, not URL-worthy.
  const { favoriteIds, toggleFavorite } = useFavoriteStations();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  // --- Server state: owned by IMGW, fetched/cached through React Query.
  const queryParams = { q, status, voivodeship, sort, dir };
  const isInitialParams =
    q === initialParams.q &&
    status === initialParams.status &&
    voivodeship === initialParams.voivodeship &&
    sort === initialParams.sort &&
    dir === initialParams.dir;
  const { data, isFetching, isError } = useHydroStations(queryParams);
  const stations = data?.data ?? (isInitialParams ? initialData.data : []);

  const visibleStations = onlyFavorites
    ? stations.filter((s) => favoriteSet.has(s.id))
    : stations;

  const handleHover = useCallback((id: StationId) => setHoveredId(id), []);
  const handleToggleFavorite = useCallback(
    (id: StationId) => toggleFavorite(id),
    [toggleFavorite],
  );

  const virtualizer = useVirtualizer({
    count: visibleStations.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">
          Monitoring hydrologiczny
        </h1>
        <p className="text-sm text-muted-foreground">
          Źródło: dane publiczne IMGW-PIB (danepubliczne.imgw.pl/api/data/hydro),
          {" "}
          {stations.length > 0 ? "aktualizowane na żywo" : "ładowanie…"}.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(["alarm", "warning", "normal", "unknown"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(status === s ? "all" : s)}
            aria-pressed={status === s}
          >
            <Card
              className={`flex flex-col gap-1 text-left transition-shadow ${
                status === s ? "ring-2 ring-ring" : ""
              }`}
            >
              <span className="text-sm text-muted-foreground">
                {STATUS_LABELS[s]}
              </span>
              <span
                className="text-3xl font-semibold tabular-nums"
                style={{ color: STATUS_COLORS[s] }}
              >
                {statusCounts[s]}
              </span>
            </Card>
          </button>
        ))}
      </div>

      <Card className="flex flex-wrap items-center gap-3">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Szukaj stacji lub rzeki…"
          className="max-w-xs"
        />

        <Select
          value={status}
          onValueChange={(v) => v && setStatus(v as StatusFilter)}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "Wszystkie statusy" : STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={voivodeship}
          onValueChange={(v) => setVoivodeship(v ?? "all")}
        >
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie województwa</SelectItem>
            {voivodeships.map((w) => (
              <SelectItem key={w} value={w}>
                {w}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(v) => v && setSort(v as SortField)}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="status">Sortuj: status</SelectItem>
            <SelectItem value="waterLevelCm">Sortuj: stan wody</SelectItem>
            <SelectItem value="name">Sortuj: nazwa</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={dir}
          onValueChange={(v) => v && setDir(v as SortDirection)}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Malejąco</SelectItem>
            <SelectItem value="asc">Rosnąco</SelectItem>
          </SelectContent>
        </Select>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Switch checked={onlyFavorites} onCheckedChange={setOnlyFavorites} />
          Tylko ulubione
        </label>

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
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-medium text-foreground">
            Stacje wodowskazowe ({visibleStations.length})
          </h2>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Switch
              checked={perfMode === "naive"}
              onCheckedChange={(checked) =>
                setPerfMode(checked ? "naive" : "optimized")
              }
            />
            Tryb naiwny (demo wydajności) — patrz README.md
          </label>
        </div>

        <div
          ref={scrollRef}
          style={{ height: LIST_HEIGHT }}
          className="overflow-y-auto rounded-md border border-border"
        >
          {perfMode === "optimized" ? (
            <div
              style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const station = visibleStations[virtualRow.index];
                return (
                  <div
                    key={station.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <StationRow
                      station={station}
                      isFavorite={favoriteSet.has(station.id)}
                      isHovered={hoveredId === station.id}
                      onHover={handleHover}
                      onToggleFavorite={handleToggleFavorite}
                      showRenderCount
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            visibleStations.map((station) => (
              <StationRowUnmemoized
                key={station.id}
                station={station}
                isFavorite={favoriteSet.has(station.id)}
                isHovered={hoveredId === station.id}
                onHover={(id) => setHoveredId(id)}
                onToggleFavorite={(id) => toggleFavorite(id)}
                showRenderCount
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
