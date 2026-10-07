import type { ValueOf } from "@/shared/types/value-of";
import type { PERF_MODE } from "../constants";
import type { StationId } from "./station";

/** The perf-demo toggle — see the case study in README.md. */
export type PerfMode = ValueOf<typeof PERF_MODE>;

export type FavoriteStationsState = {
  favoriteIds: StationId[];
  toggleFavorite: (id: StationId) => void;
  isFavorite: (id: StationId) => boolean;
};
