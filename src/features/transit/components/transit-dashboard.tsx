"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useUrlState } from "@/shared/hooks/use-url-state";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";
import { useVehiclePositions } from "../hooks/use-vehicle-positions";
import { VehicleList } from "./vehicle-list";
import {
  VEHICLE_TYPE_COLOR_VAR,
  VEHICLE_TYPE_LABELS,
} from "../constants";
import type { Vehicle, VehicleId, VehicleType, VehiclesSnapshot } from "../types";

const LEGEND_TYPES: VehicleType[] = ["bus", "tram", "other"];

const TransitMap = dynamic(
  () => import("./transit-map").then((m) => m.TransitMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  },
);

type Props = {
  initialRoute: string;
  initialSnapshot: VehiclesSnapshot;
};

export function TransitDashboard({ initialRoute, initialSnapshot }: Props) {
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

  const debouncedSearch = useDebouncedValue(searchInput, 300);
  useEffect(() => {
    if (debouncedSearch !== route) setRoute(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only route's setter should react to the debounced value
  }, [debouncedSearch]);

  const { data, isError } = useVehiclePositions(route);
  const isInitial = route === initialRoute;
  const snapshot = data ?? (isInitial ? initialSnapshot : null);
  const vehicles = useMemo(() => snapshot?.vehicles ?? [], [snapshot]);

  const routeCount = useMemo(
    () => new Set(vehicles.map((v) => v.routeShortName)).size,
    [vehicles],
  );
  const avgDelay = useMemo(() => {
    if (vehicles.length === 0) return 0;
    return Math.round(
      vehicles.reduce((sum, v) => sum + v.delaySeconds, 0) / vehicles.length,
    );
  }, [vehicles]);

  const selectedVehicle: Vehicle | null =
    vehicles.find((v) => v.id === selectedVehicleId) ?? null;

  // "other" is a real, handled case (see server/queries.ts) but doesn't
  // currently occur in practice — only show it in the legend if a vehicle
  // actually has that type, rather than permanently showing a category
  // that would otherwise always be empty.
  const legendTypes = LEGEND_TYPES.filter(
    (type) => type !== "other" || vehicles.some((v) => v.vehicleType === type),
  );

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            Aktywne pojazdy
          </span>
          <span className="text-3xl font-semibold tabular-nums text-foreground">
            {vehicles.length}
          </span>
        </Card>
        <Card className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Linie</span>
          <span className="text-3xl font-semibold tabular-nums text-foreground">
            {routeCount}
          </span>
        </Card>
        <Card className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            Średnie opóźnienie
          </span>
          <span className="text-3xl font-semibold tabular-nums text-foreground">
            {avgDelay >= 0 ? "+" : ""}
            {Math.round(avgDelay / 60)} min
          </span>
        </Card>
      </div>

      <Card className="flex flex-wrap items-center gap-4">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Filtruj po numerze linii…"
          aria-label="Filtruj po numerze linii"
          className="max-w-xs"
        />
        <ul className="flex items-center gap-4 text-sm text-muted-foreground">
          {legendTypes.map((type) => (
            <li key={type} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: VEHICLE_TYPE_COLOR_VAR[type] }}
              />
              {VEHICLE_TYPE_LABELS[type]}
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* Not <Card> here: Card bakes in p-4, which would compete with
            this panel's own p-0 at equal CSS specificity — Tailwind's
            generated rule order, not JSX class order, decides that race,
            so it's not safe to rely on. A plain div mirroring Card's other
            styles avoids the conflict entirely. */}
        <div className="h-[560px] overflow-hidden rounded-lg border border-chart-baseline/30 bg-chart-surface">
          <TransitMap
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
}
