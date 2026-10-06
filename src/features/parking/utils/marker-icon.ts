import L from "leaflet";
import { escapeHtml } from "@/shared/utils/escape-html";
import type { ParkingLot } from "../types";
import { spotsWord } from "./format";

/** The marker's visible label is the free-spot count itself, so status
 * never depends on color alone (WCAG 1.4.1). Leaflet renders a keyboard-
 * focusable `role="button"` for each marker; the sr-only text gives it a
 * full accessible name ("P01 Galeria Bałtycka: 869 wolnych miejsc"). */
export function createLotIcon(lot: ParkingLot, selected: boolean): L.DivIcon {
  const spots = lot.availableSpots;
  const visible = spots === null ? "?" : String(spots);
  const spoken =
    spots === null ? "brak danych" : `${spots} wolnych ${spotsWord(spots)}`;
  const classes = ["parking-marker", `parking-marker--${lot.status}`];
  if (selected) classes.push("parking-marker--selected");
  return L.divIcon({
    className: "parking-marker-icon",
    html: `<span class="${classes.join(" ")}"><span class="sr-only">${escapeHtml(`${lot.shortName} ${lot.name}: ${spoken}`)}</span><span aria-hidden="true">${visible}</span></span>`,
    iconSize: [44, 26],
    iconAnchor: [22, 13],
  });
}
