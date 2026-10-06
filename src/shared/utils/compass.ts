import { COMPASS_POINTS } from "@/shared/constants/compass";

/** Converts a compass bearing in degrees (0-360) to its 16-point label. */
export function degreesToCompass(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % COMPASS_POINTS.length;
  return COMPASS_POINTS[index];
}
