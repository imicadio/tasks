import { STATUS_LABELS } from "../../constants";
import type { IncidentStatus } from "../../types";

/** A loud "NOWY INCYDENT" pill for fresh reports, a quiet status otherwise. */
export const IncidentStatusBadge = ({ status }: { status: IncidentStatus }) => {
  if (status === "new") {
    return (
      <span className="rounded-full bg-incident-new px-2 py-0.5 text-[0.7rem] font-bold tracking-wide text-white">
        NOWY INCYDENT
      </span>
    );
  }
  return (
    <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
      {STATUS_LABELS[status]}
    </span>
  );
};
