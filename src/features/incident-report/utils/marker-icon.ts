import L from "leaflet";
import { escapeHtml } from "@/shared/utils/escape-html";
import { STATUS_LABELS } from "../constants";
import type { Incident } from "../types";

// Leaflet touches `window` on import: this file is client-only and is
// deliberately not re-exported from utils/index.ts.

/** A severity-colored dot; a `new` incident additionally gets a pulsing ring
 * and a visible "NOWY INCYDENT" label, so newness never depends on color or
 * motion alone (WCAG 1.4.1, 2.3.3 — the pulse stops under reduced motion).
 * The sr-only text is the marker's accessible name. */
export function createIncidentIcon(incident: Incident, selected: boolean): L.DivIcon {
  const isNew = incident.status === "new";
  const classes = [
    "incident-marker",
    `incident-marker--${incident.severity}`,
  ];
  if (isNew) classes.push("incident-marker--new");
  if (selected) classes.push("incident-marker--selected");
  const spoken = `${STATUS_LABELS[incident.status]}: ${incident.title}, ${incident.address}`;
  return L.divIcon({
    className: "incident-marker-icon",
    html:
      `<span class="${classes.join(" ")}">` +
      `<span class="sr-only">${escapeHtml(spoken)}</span>` +
      (isNew ? '<span class="incident-marker__pulse" aria-hidden="true"></span>' : "") +
      '<span class="incident-marker__dot" aria-hidden="true"></span>' +
      (isNew
        ? '<span class="incident-marker__label" aria-hidden="true">NOWY INCYDENT</span>'
        : "") +
      "</span>",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
}

/** The draft's chosen location, while the form is open. */
export function createPickedIcon(): L.DivIcon {
  return L.divIcon({
    className: "incident-marker-icon",
    html: '<span class="incident-picked"><span class="sr-only">Wybrane miejsce zgłoszenia</span></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}
