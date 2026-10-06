import type { RefObject } from "react";
import type { HydroStation, StationId } from "./station";

/** What both row renderers (virtualized and naive) need. */
export type StationRowsProps = {
  stations: HydroStation[];
  favoriteIds: Set<StationId>;
  hoveredId: StationId | null;
  setHoveredId: (id: StationId) => void;
  toggleFavorite: (id: StationId) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
};
