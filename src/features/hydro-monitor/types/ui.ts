import type { StationId } from "./station";

/** The perf-demo toggle — see the case study in README.md. */
export type PerfMode = "optimized" | "naive";

export type FavoriteStationsState = {
  favoriteIds: StationId[];
  toggleFavorite: (id: StationId) => void;
  isFavorite: (id: StationId) => boolean;
};
