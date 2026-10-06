import L from "leaflet";
import type { VehicleType } from "../types";

/** A colored dot with an arrow rotated to the vehicle's heading; styled by
 * the `.transit-marker*` classes in globals.css. */
export function createVehicleIcon(
  direction: number,
  type: VehicleType,
  highlighted: boolean,
): L.DivIcon {
  const classes = ["transit-marker", `transit-marker--${type}`];
  if (highlighted) classes.push("transit-marker--selected");
  return L.divIcon({
    className: "",
    html: `<div class="${classes.join(" ")}"><div class="transit-marker__arrow" style="transform: rotate(${direction}deg)"></div></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}
