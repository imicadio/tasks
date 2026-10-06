"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useUrlState } from "@/shared/hooks/use-url-state";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { SEARCH_DEBOUNCE_MS } from "../constants";
import { useVehiclePositions } from "../hooks/use-vehicle-positions";
import type { Vehicle, VehicleId, VehiclesSnapshot } from "../types";
import { LazyTransitMap } from "./_internal/lazy-transit-map";
import { TransitKpiTiles } from "./_internal/transit-kpi-tiles";
import { VehicleTypeLegend } from "./_internal/vehicle-type-legend";
import { VehicleList } from "./vehicle-list";

type Props = {
  initialRoute: string;
  initialSnapshot: VehiclesSnapshot;
};

export const TransitDashboard = ({ initialRoute, initialSnapshot }: Props) => {
  const [searchInput, setSearchInput] = useState(initialRoute);
  // The URL key must match transitQuerySchema's field name ("route") —
  // page.tsx parses raw searchParams straight through that schema for SSR,
  // so a mismatched key here would silently drop the filter on first
  // load/bookmark (an existing bug elsewhere in this app, just fixed
  // alongside this feature — see hydro-monitor-dashboard.tsx's history).
  const [route, setRoute] = useUrlState("route", initialRoute);
  const [selectedVehicleId, setSelectedVehicleId] = useState<VehicleId | null>(
    null,
  );

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  useEffect(() => {
    if (debouncedSearch !== route) setRoute(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only route's setter should react to the debounced value
  }, [debouncedSearch]);

  const { data, isError } = useVehiclePositions(route);
  const isInitial = route === initialRoute;
  const snapshot = data ?? (isInitial ? initialSnapshot : null);
  const vehicles = useMemo(() => snapshot?.vehicles ?? [], [snapshot]);

  const selectedVehicle: Vehicle | null =
    vehicles.find((v) => v.id === selectedVehicleId) ?? null;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearchInput(event.target.value);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">
          Gdańsk — transport publiczny
        </h1>
        <p className="text-sm text-muted-foreground">
          Źródło: Tristar / ZTM Gdańsk (ckan.multimediagdansk.pl), pozycje
          GPS na żywo.
          {isError && " Nie udało się odświeżyć pozycji."}
        </p>
      </header>

      <TransitKpiTiles vehicles={vehicles} />

      <Card className="flex flex-wrap items-center gap-4">
        <Input
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Filtruj po numerze linii…"
          aria-label="Filtruj po numerze linii"
          className="max-w-xs"
        />
        <VehicleTypeLegend vehicles={vehicles} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* Not <Card> here: Card bakes in p-4, which would compete with
            this panel's own p-0 at equal CSS specificity — Tailwind's
            generated rule order, not JSX class order, decides that race,
            so it's not safe to rely on. A plain div mirroring Card's other
            styles avoids the conflict entirely. */}
        <div className="h-[560px] overflow-hidden rounded-lg border border-chart-baseline/30 bg-chart-surface">
          <LazyTransitMap
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
            flyToTarget={selectedVehicle}
          />
        </div>
        <div className="h-[560px] overflow-hidden rounded-lg border border-chart-baseline/30 bg-chart-surface">
          <VehicleList
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
          />
        </div>
      </div>
    </div>
  );
};
