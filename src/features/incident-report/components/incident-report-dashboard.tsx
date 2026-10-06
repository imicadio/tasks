"use client";

import { useMemo, useState } from "react";
import { SEED_INCIDENTS } from "../constants";
import { useStoreHydrated } from "../hooks/use-store-hydrated";
import { useIncidentReportStore } from "../store";
import type { Incident } from "../types";
import { draftPoint } from "../utils/draft";
import { FormPanel } from "./_internal/form-panel";
import { MapPanel } from "./_internal/map-panel";

export const IncidentReportDashboard = () => {
  const hydrated = useStoreHydrated();
  const reports = useIncidentReportStore((state) => state.reports);
  const step = useIncidentReportStore((state) => state.step);
  const draft = useIncidentReportStore((state) => state.draft);
  const pickLocation = useIncidentReportStore((state) => state.pickLocation);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const incidents = useMemo(() => [...reports, ...SEED_INCIDENTS], [reports]);
  const picking = hydrated && step === 1;

  const handleSubmitted = (incident: Incident) => setSelectedId(incident.id);
  const handlePick = (lat: number, lon: number) => {
    setSelectedId(null);
    void pickLocation(lat, lon);
  };

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
        <FormPanel hydrated={hydrated} onSubmitted={handleSubmitted} />
        <MapPanel
          incidents={incidents}
          selectedId={selectedId}
          onSelect={setSelectedId}
          picked={draftPoint(draft)}
          onPick={picking ? handlePick : undefined}
        />
      </div>
    </div>
  );
};
