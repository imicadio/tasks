"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StationId } from "./types";

/**
 * Global client state: which stations the viewer pinned. Not server data
 * (IMGW has no notion of "favorites"), not URL-shareable in any meaningful
 * way, and used across more than one component (the filter bar's "only
 * favorites" toggle and every row's star button) — the textbook case for a
 * small global store rather than prop-drilled local state.
 * See docs/decisions/0002-state-architecture.md.
 */
type FavoriteStationsState = {
  favoriteIds: StationId[];
  toggleFavorite: (id: StationId) => void;
  isFavorite: (id: StationId) => boolean;
};

export const useFavoriteStations = create<FavoriteStationsState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((favoriteId) => favoriteId !== id)
            : [...state.favoriteIds, id],
        })),
      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    { name: "hydro-monitor:favorite-stations" },
  ),
);
