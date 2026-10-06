"use client";

import type { StationId, StationRowsProps } from "../../types";
import { StationRowUnmemoized } from "../station-row";

/** The perf demo's naive rendering: every row mounted, no memoization, and
 * handlers recreated on each render — so every row re-renders on any hover.
 * Deliberately unoptimized; see README.md. */
export const NaiveStationRows = ({
  stations,
  favoriteIds,
  hoveredId,
  setHoveredId,
  toggleFavorite,
}: StationRowsProps) => {
  const handleHover = (id: StationId) => setHoveredId(id);
  const handleToggleFavorite = (id: StationId) => toggleFavorite(id);

  return stations.map((station) => (
    <StationRowUnmemoized
      key={station.id}
      station={station}
      isFavorite={favoriteIds.has(station.id)}
      isHovered={hoveredId === station.id}
      onHover={handleHover}
      onToggleFavorite={handleToggleFavorite}
    />
  ));
};
