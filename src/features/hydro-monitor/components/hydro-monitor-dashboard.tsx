"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
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
import { labelOf } from "@/shared/utils/label-of";
import {
  DIR_LABELS,
  LIST_HEIGHT,
  ROW_HEIGHT,
  SEARCH_DEBOUNCE_MS,
  SORT_LABELS,
  STATUS_FILTER_LABELS,
  STATUS_FILTERS,
} from "../constants";
import { useFavoriteStations } from "../store";
import { useHydroStations } from "../hooks/use-hydro-stations";
import { StationRow, StationRowUnmemoized } from "./station-row";
import { StationsTable } from "./_internal/stations-table";
import { StatusKpiTiles } from "./_internal/status-kpi-tiles";
import type {
  HydroPageData,
  HydroStationsParams,
  PerfMode,
  SortDirection,
  SortField,
  StationId,
  StationStatus,
  StatusFilter,
} from "../types";
import { formatVoivodeshipOption } from "../utils/format-voivodeship-option";

type Props = HydroPageData & {
  initialParams: HydroStationsParams;
};

export const HydroMonitorDashboard = ({
  initialParams,
  initialData,
  voivodeships,
  statusCounts,
}: Props) => {
  // --- Local state: transient, UI-only, not worth sharing or persisting.
  const [searchInput, setSearchInput] = useState(initialParams.q);
  const [hoveredId, setHoveredId] = useState<StationId | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [perfMode, setPerfMode] = useState<PerfMode>("optimized");
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- URL state: shareable/bookmarkable filters (the query itself).
  const [status, setStatus] = useUrlState<StatusFilter>(
    "status",
    initialParams.status,
  );
  // Key must match hydroQuerySchema's "voivodeship" field — page.tsx parses
  // raw searchParams straight through that schema for SSR, so a mismatched
  // URL key here silently drops the filter on first load/bookmark (this
  // was "wojewodztwo" and didn't match; fixed).
  const [voivodeship, setVoivodeship] = useUrlState(
    "voivodeship",
    initialParams.voivodeship,
  );
  const [sort, setSort] = useUrlState<SortField>("sort", initialParams.sort);
  const [dir, setDir] = useUrlState<SortDirection>("dir", initialParams.dir);
  const [q, setQ] = useUrlState("q", initialParams.q);

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
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

  const handleKpiSelect = (selected: StationStatus) =>
    setStatus(status === selected ? "all" : selected);
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearchInput(event.target.value);
  const handleStatusChange = (value: StatusFilter | null) => {
    if (value) setStatus(value);
  };
  const handleVoivodeshipChange = (value: string | null) =>
    setVoivodeship(value ?? "all");
  const handleSortChange = (value: SortField | null) => {
    if (value) setSort(value);
  };
  const handleDirChange = (value: SortDirection | null) => {
    if (value) setDir(value);
  };
  const handlePerfModeChange = (naive: boolean) =>
    setPerfMode(naive ? "naive" : "optimized");
  // Naive mode only: plain functions recreated on every render, so each
  // unmemoized row gets new props every time — that's the point of the
  // demo (see README.md). The optimized rows use the stable useCallback
  // handlers above.
  const handleHoverNaive = (id: StationId) => setHoveredId(id);
  const handleToggleFavoriteNaive = (id: StationId) => toggleFavorite(id);

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

      <StatusKpiTiles
        counts={statusCounts}
        activeStatus={status}
        onSelect={handleKpiSelect}
      />

      <Card className="flex flex-wrap items-center gap-3">
        <Input
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Szukaj stacji lub rzeki…"
          aria-label="Szukaj stacji lub rzeki"
          className="max-w-xs"
        />

        <Select
          value={status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger aria-label="Filtruj według statusu" className="w-44">
            <SelectValue>
              {labelOf(STATUS_FILTER_LABELS)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_FILTER_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={voivodeship}
          onValueChange={handleVoivodeshipChange}
        >
          <SelectTrigger aria-label="Filtruj według województwa" className="w-52">
            <SelectValue>
              {formatVoivodeshipOption}
            </SelectValue>
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
          onValueChange={handleSortChange}
        >
          <SelectTrigger aria-label="Sortuj wyniki według" className="w-44">
            <SelectValue>{labelOf(SORT_LABELS)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="status">{SORT_LABELS.status}</SelectItem>
            <SelectItem value="waterLevelCm">{SORT_LABELS.waterLevelCm}</SelectItem>
            <SelectItem value="name">{SORT_LABELS.name}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={dir}
          onValueChange={handleDirChange}
        >
          <SelectTrigger aria-label="Kierunek sortowania" className="w-36">
            <SelectValue>{labelOf(DIR_LABELS)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">{DIR_LABELS.desc}</SelectItem>
            <SelectItem value="asc">{DIR_LABELS.asc}</SelectItem>
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
              onCheckedChange={handlePerfModeChange}
            />
            Tryb naiwny (demo wydajności) — patrz README.md
          </label>
        </div>

        <div className="grid h-9 grid-cols-[auto_1.4fr_1fr_1.2fr_auto] items-center gap-3 border-b border-border px-3 text-xs font-medium text-muted-foreground">
          <span className="sr-only">Ulubione</span>
          <span>Stacja</span>
          <span>Województwo</span>
          <span>Stan wody</span>
          <span>Status</span>
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
                onHover={handleHoverNaive}
                onToggleFavorite={handleToggleFavoriteNaive}
              />
            ))
          )}
        </div>

        {/* The virtualized list above is the visual/interactive UI, but it's
            plain divs — no table semantics a screen reader can navigate by
            row/column, and retrofitting ARIA grid roles onto an absolutely
            positioned, windowed list is easy to get subtly wrong (WAI-ARIA
            Authoring Practices: "no ARIA is better than bad ARIA"). This
            real <table> gives assistive tech the same data through native,
            well-supported semantics instead — see
            docs/decisions/0005-accessibility.md. It's additive, not a
            replacement: the visual list above stays fully keyboard-operable
            on its own. Favoriting isn't available from this table yet; see
            docs/TECH_DEBT.md. */}
        <StationsTable stations={visibleStations} />
      </Card>
    </div>
  );
};
