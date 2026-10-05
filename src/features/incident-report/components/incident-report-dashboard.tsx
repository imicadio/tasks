"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { SEED_INCIDENTS } from "../constants";
import { useIncidentReportStore } from "../store";
import type { Incident } from "../types";
import { IncidentForm } from "./incident-form";
import { IncidentList } from "./incident-list";

// Leaflet touches `window` on import — client-only, as in transit/parking.
const IncidentMap = dynamic(
  () => import("./incident-map").then((m) => m.IncidentMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  },
);

export function IncidentReportDashboard() {
  const [hydrated, setHydrated] = useState(false);
  const reports = useIncidentReportStore((state) => state.reports);
  const step = useIncidentReportStore((state) => state.step);
  const draft = useIncidentReportStore((state) => state.draft);
  const pickLocation = useIncidentReportStore((state) => state.pickLocation);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // The store skips automatic hydration (see store.ts) — read localStorage
  // only after mount so the server and first client render agree.
  useEffect(() => {
    void Promise.resolve(useIncidentReportStore.persist.rehydrate()).then(() =>
      setHydrated(true),
    );
  }, []);

  const incidents = useMemo<Incident[]>(
    () => [...reports, ...SEED_INCIDENTS],
    [reports],
  );

  const picking = hydrated && step === 1;
  const picked: [number, number] | null =
    draft.lat !== null && draft.lon !== null
      ? [draft.lat, draft.lon]
      : null;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">
          Gdańsk — zgłoś incydent
        </h1>
        <p className="text-sm text-muted-foreground">
          Zgłoś zdarzenie w trzech krokach. Dane zapisywane są lokalnie w tej
          przeglądarce (localStorage) — nic nie jest wysyłane na serwer.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section aria-labelledby="incident-form-heading">
          <Card className="flex flex-col gap-4 p-5">
            <h2 id="incident-form-heading" className="sr-only">
              Formularz zgłoszenia
            </h2>
            {hydrated ? (
              <IncidentForm
                onSubmitted={(incident) => setSelectedId(incident.id)}
              />
            ) : (
              <div className="flex flex-col gap-4" aria-busy="true">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            )}
          </Card>
        </section>

        <section
          aria-labelledby="incident-map-heading"
          className="flex flex-col gap-3 lg:sticky lg:top-4 lg:self-start"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="incident-map-heading" className="text-lg font-semibold text-foreground">
              Mapa incydentów
            </h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {picking
                ? "Kliknij na mapie — współrzędne i adres uzupełnią się same."
                : `${incidents.length} incydentów na mapie`}
            </p>
          </div>
          {/* Not <Card>: Card's built-in p-4 would compete with p-0 here —
              see the same note in transit-dashboard.tsx. */}
          <div
            className={`h-[420px] overflow-hidden rounded-lg border bg-chart-surface lg:h-[480px] ${
              picking ? "border-primary ring-3 ring-primary/30" : "border-chart-baseline/30"
            }`}
          >
            <IncidentMap
              incidents={incidents}
              selectedId={selectedId}
              onSelect={setSelectedId}
              picked={picked}
              onPick={
                picking
                  ? (lat, lon) => {
                      setSelectedId(null);
                      void pickLocation(lat, lon);
                    }
                  : undefined
              }
            />
          </div>
          <IncidentList
            incidents={incidents}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>
      </div>
    </div>
  );
}
