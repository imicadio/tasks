import type { LatLng } from "../types";

/** Linear interpolation, clamped to [a, b] for t outside [0, 1]. */
export function lerp(a: number, b: number, t: number): number {
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
  return a + (b - a) * clamped;
}

/**
 * Straight-line interpolation between two GPS fixes — not map-matched to
 * actual streets, since we only ever have two sparse points and no route
 * geometry to snap to. Honest about what it is: a smoothed estimate of
 * where the vehicle probably is between two real readings, not a
 * reconstruction of its actual path. See
 * docs/decisions/0006-realtime-map-rendering.md.
 */
export function interpolateLatLng(
  from: LatLng,
  to: LatLng,
  t: number,
): LatLng {
  return {
    lat: lerp(from.lat, to.lat, t),
    lon: lerp(from.lon, to.lon, t),
  };
}
