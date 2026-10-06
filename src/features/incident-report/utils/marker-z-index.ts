import type { Incident } from "../types";

/** Stacking order on the map: new reports on top, then the selected one. */
export function markerZIndex(incident: Pick<Incident, "status">, selected: boolean): number {
  if (incident.status === "new") return 1000;
  if (selected) return 500;
  return 0;
}
