"use client";

import { useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ROW_HEIGHT, VIRTUAL_OVERSCAN } from "../../constants";
import type { StationId, StationRowsProps } from "../../types";
import { virtualRowStyle } from "../../utils/virtual-row-style";
import { StationRow } from "../station-row";

/** Optimized rendering: only the rows in view are mounted (virtualized),
 * each row is memoized, and the handlers are stable — hovering re-renders
 * exactly the two rows whose `isHovered` changed. */
export const VirtualStationRows = ({
  stations,
  favoriteIds,
  hoveredId,
  setHoveredId,
  toggleFavorite,
  scrollRef,
}: StationRowsProps) => {
  const handleHover = useCallback((id: StationId) => setHoveredId(id), [setHoveredId]);
  const handleToggleFavorite = useCallback(
    (id: StationId) => toggleFavorite(id),
    [toggleFavorite],
  );
  const getScrollElement = useCallback(() => scrollRef.current, [scrollRef]);
  const estimateSize = useCallback(() => ROW_HEIGHT, []);

  const virtualizer = useVirtualizer({
    count: stations.length,
    getScrollElement,
    estimateSize,
    overscan: VIRTUAL_OVERSCAN,
  });

  return (
    <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const station = stations[virtualRow.index];
        return (
          <div key={station.id} style={virtualRowStyle(virtualRow)}>
            <StationRow
              station={station}
              isFavorite={favoriteIds.has(station.id)}
              isHovered={hoveredId === station.id}
              onHover={handleHover}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        );
      })}
    </div>
  );
};
