import { INCIDENT_STATUS } from "../../constants";
import { cn } from "@/shared/utils/cn";
import type { Incident } from "../../types";
import { formatDateTime, formatIncidentMeta } from "../../utils/format";
import { IncidentDot } from "./incident-dot";
import { IncidentStatusBadge } from "./incident-status-badge";

type Props = {
  incident: Incident;
  selected: boolean;
  onSelect: () => void;
};

/** One incident in the list; activating it selects it on the map. */
export const IncidentListItem = ({ incident, selected, onSelect }: Props) => {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border bg-chart-surface p-3 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50",
        selected ? "border-primary" : "border-chart-baseline/30",
        incident.status === INCIDENT_STATUS.New && "border-incident-new/60",
      )}
    >
      <IncidentDot incident={incident} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-medium text-foreground">{incident.title}</span>
          <IncidentStatusBadge status={incident.status} />
        </span>
        <span className="truncate text-sm text-muted-foreground">{incident.address}</span>
        <span className="text-xs text-muted-foreground">
          {formatIncidentMeta(incident)} · {formatDateTime(incident.occurredAt)}
        </span>
      </span>
    </button>
  );
};
