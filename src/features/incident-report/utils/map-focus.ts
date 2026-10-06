import type { Incident, LatLngTuple } from "../types";

/** Where the map should fly: the selected incident if there is one;
 * otherwise, while the user is picking a location, the picked point. */
export function mapFocusTarget(
  selected: Incident | undefined,
  picked: LatLngTuple | null,
  isPicking: boolean,
): LatLngTuple | null {
  if (selected) return [selected.lat, selected.lon];
  return isPicking ? picked : null;
}
