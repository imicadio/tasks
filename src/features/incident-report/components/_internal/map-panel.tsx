import { cn } from "@/shared/utils/cn";
import type { Incident, LatLngTuple } from "../../types";
import { IncidentList } from "../incident-list";
import { LazyIncidentMap } from "./lazy-incident-map";

type Props = {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  picked: LatLngTuple | null;
  /** Set while the form's location step is active: map clicks pick a point. */
  onPick?: (lat: number, lon: number) => void;
};

/** The incident map with its text-equivalent list underneath. */
export const MapPanel = ({ incidents, selectedId, onSelect, picked, onPick }: Props) => {
  const picking = onPick !== undefined;

  return (
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
        className={cn(
          "h-[420px] overflow-hidden rounded-lg border bg-chart-surface lg:h-[480px]",
          picking ? "border-primary ring-3 ring-primary/30" : "border-chart-baseline/30",
        )}
      >
        <LazyIncidentMap
          incidents={incidents}
          selectedId={selectedId}
          onSelect={onSelect}
          picked={picked}
          onPick={onPick}
        />
      </div>
      <IncidentList incidents={incidents} selectedId={selectedId} onSelect={onSelect} />
    </section>
  );
};
