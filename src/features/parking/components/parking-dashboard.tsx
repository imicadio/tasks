"use client";

import { useMemo, useState } from "react";
import { AVAILABILITY_STATUSES } from "../constants";
import { useParkingLots } from "../hooks/use-parking-lots";
import type { ParkingLotId, ParkingSnapshot } from "../types";
import { LazyParkingMap } from "./_internal/lazy-parking-map";
import { ParkingKpiTiles } from "./_internal/parking-kpi-tiles";
import { AvailabilityBadge } from "./availability-badge";
import { ParkingTable } from "./parking-table";

type Props = {
  initialSnapshot: ParkingSnapshot;
};

export const ParkingDashboard = ({ initialSnapshot }: Props) => {
  const { data, isError } = useParkingLots(initialSnapshot);
  const lots = useMemo(() => data?.parkingLots ?? [], [data]);
  const [selectedLotId, setSelectedLotId] = useState<ParkingLotId | null>(
    null,
  );

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">
          Gdańsk — parkingi
        </h1>
        <p className="text-sm text-muted-foreground">
          Źródło: ckan.multimediagdansk.pl, wolne miejsca odświeżane co
          minutę.
        </p>
        {/* Announced politely only when refreshing fails — the regular
            per-minute number changes are deliberately not live-announced,
            which would be noise for screen-reader users. */}
        <p role="status" className="text-sm text-muted-foreground">
          {isError && "Nie udało się odświeżyć danych — pokazuję ostatnie znane."}
        </p>
      </header>

      <ParkingKpiTiles lots={lots} lastUpdate={data?.lastUpdate ?? null} />

      <section aria-labelledby="parking-map-heading" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="parking-map-heading" className="text-lg font-semibold text-foreground">
            Mapa
          </h2>
          <ul aria-label="Legenda" className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {AVAILABILITY_STATUSES.map((status) => (
              <li key={status}>
                <AvailabilityBadge status={status} />
              </li>
            ))}
          </ul>
        </div>
        {/* Not <Card>: Card's built-in p-4 would compete with p-0 here —
            see the same note in transit-dashboard.tsx. */}
        <div className="h-[480px] overflow-hidden rounded-lg border border-chart-baseline/30 bg-chart-surface">
          <LazyParkingMap
            lots={lots}
            selectedLotId={selectedLotId}
            onSelectLot={setSelectedLotId}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Liczba na znaczniku to wolne miejsca; „?” oznacza brak danych dla
          parkingu.
        </p>
      </section>

      <section aria-labelledby="parking-table-heading" className="flex flex-col gap-3">
        <h2 id="parking-table-heading" className="text-lg font-semibold text-foreground">
          Tabela
        </h2>
        <div className="rounded-lg border border-chart-baseline/30 bg-chart-surface py-3">
          <ParkingTable
            lots={lots}
            selectedLotId={selectedLotId}
            onSelectLot={setSelectedLotId}
          />
        </div>
      </section>
    </div>
  );
};
