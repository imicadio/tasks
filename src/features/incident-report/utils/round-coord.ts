import { COORD_DECIMALS } from "../constants";

/** Rounds a map-click coordinate to COORD_DECIMALS (~11 cm), which keeps the
 * geocode cache keys stable. */
export function roundCoord(value: number): number {
  return Number(value.toFixed(COORD_DECIMALS));
}
