"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { useParkingLots } from "../hooks/use-parking-lots";
import { ParkingTable } from "./parking-table";
import { AvailabilityBadge } from "./availability-badge";
import { formatTime } from "../lib/format";
import type { AvailabilityStatus, ParkingLotId, ParkingSnapshot } from "../types";

const LEGEND: AvailabilityStatus[] = ["available", "few", "full", "unknown"];

// Leaflet touches `window` on import — client-only, as in transit.
const ParkingMap = dynamic(
  () => import("./parking-map").then((m) => m.ParkingMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  },
);

type Props = {
  initialSnapshot: ParkingSnapshot;
};

export function ParkingDashboard({ initialSnapshot }: Props) {
  const { data, isError } = useParkingLots(initialSnapshot);
  const lots = useMemo(() => data?.parkingLots ?? [], [data]);
  const [selectedLotId, setSelectedLotId] = useState<ParkingLotId | null>(
    null,
  );

  const reportingLots = lots.filter((lot) => lot.availableSpots !== null);
  const fullLots = lots.filter((lot) => lot.status === "full");
  const totalFree = reportingLots.reduce(
    (sum, lot) => sum + (lot.availableSpots ?? 0),
    0,
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            Parkingi bez wolnych miejsc
          </span>
          <span className="text-3xl font-semibold tabular-nums text-foreground">
            {fullLots.length} / {lots.length}
          </span>
        </Card>
        <Card className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            Wolne miejsca łącznie
          </span>
          <span className="text-3xl font-semibold tabular-nums text-foreground">
            {totalFree}
          </span>
        </Card>
        <Card className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            Ostatnia aktualizacja
          </span>
          <span className="text-3xl font-semibold tabular-nums text-foreground">
            {formatTime(data?.lastUpdate ?? null)}
          </span>
        </Card>
      </div>

      <section aria-labelledby="parking-map-heading" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="parking-map-heading" className="text-lg font-semibold text-foreground">
            Mapa
          </h2>
          <ul aria-label="Legenda" className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {LEGEND.map((status) => (
              <li key={status}>
                <AvailabilityBadge status={status} />
              </li>
            ))}
          </ul>
        </div>
        {/* Not <Card>: Card's built-in p-4 would compete with p-0 here —
            see the same note in transit-dashboard.tsx. */}
        <div className="h-[480px] overflow-hidden rounded-lg border border-chart-baseline/30 bg-chart-surface">
          <ParkingMap
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
}
