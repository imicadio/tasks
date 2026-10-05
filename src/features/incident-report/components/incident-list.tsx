import { cn } from "cn";
import {
  CATEGORY_LABELS,
  SEVERITY_COLOR_VAR,
  SEVERITY_LABELS,
  STATUS_LABELS,
} from "../constants";
import { formatDateTime } from "../lib/format";
import type { Incident } from "../types";

/** The map's text equivalent: every incident as a list item; activating one
 * flies the map to it. */
export function IncidentList({
  incidents,
  selectedId,
  onSelect,
}: {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ul aria-label="Lista incydentów" className="flex flex-col gap-2">
      {incidents.map((incident) => {
        const isNew = incident.status === "new";
        return (
          <li key={incident.id}>
            <button
              type="button"
              aria-pressed={incident.id === selectedId}
              onClick={() => onSelect(incident.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border bg-chart-surface p-3 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50",
                incident.id === selectedId ? "border-primary" : "border-chart-baseline/30",
                isNew && "border-incident-new/60",
              )}
            >
              <span
                aria-hidden="true"
                className={cn("mt-1.5 shrink-0", isNew ? "incident-live-dot" : "size-2.5 rounded-full")}
                style={isNew ? undefined : { backgroundColor: SEVERITY_COLOR_VAR[incident.severity] }}
              />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-medium text-foreground">{incident.title}</span>
                  {isNew ? (
                    <span className="rounded-full bg-incident-new px-2 py-0.5 text-[0.7rem] font-bold tracking-wide text-white">
                      NOWY INCYDENT
                    </span>
                  ) : (
                    <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                      {STATUS_LABELS[incident.status]}
                    </span>
                  )}
                </span>
                <span className="truncate text-sm text-muted-foreground">
                  {incident.address}
                </span>
                <span className="text-xs text-muted-foreground">
                  {CATEGORY_LABELS[incident.category]} · zagrożenie{" "}
                  {SEVERITY_LABELS[incident.severity].toLowerCase()} ·{" "}
                  {formatDateTime(incident.occurredAt)}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
