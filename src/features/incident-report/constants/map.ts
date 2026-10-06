export {
  DEFAULT_ZOOM,
  FOCUS_ZOOM,
  GDANSK_CENTER,
} from "@/shared/constants/map";

/** A generous box around Gdańsk — reports outside it are rejected. */
export const GDANSK_BOUNDS = {
  minLat: 54.27,
  maxLat: 54.45,
  minLon: 18.43,
  maxLon: 18.95,
} as const;
