"use client";

import { useMemo, useRef, useState } from "react";
import { Card } from "@/shared/ui/card";
import { LIST_HEIGHT } from "../../constants";
import { useFavoriteStations } from "../../store";
import type { HydroStation, PerfMode, StationId } from "../../types";
import { PerfModeSwitch } from "./perf-mode-switch";
import { StationListHeader } from "./station-list-header";
import { StationRows } from "./station-rows";
import { StationsTable } from "./stations-table";

type Props = { stations: HydroStation[] };

/** The station list card: heading, perf-demo toggle, the scrollable rows,
 * and the screen-reader table carrying the same data. */
export const StationList = ({ stations }: Props) => {
  const [perfMode, setPerfMode] = useState<PerfMode>("optimized");
  const [hoveredId, setHoveredId] = useState<StationId | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { favoriteIds, toggleFavorite } = useFavoriteStations();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-medium text-foreground">
          Stacje wodowskazowe ({stations.length})
        </h2>
        <PerfModeSwitch value={perfMode} onChange={setPerfMode} />
      </div>

      <StationListHeader />
      <div
        ref={scrollRef}
        style={{ height: LIST_HEIGHT }}
        className="overflow-y-auto rounded-md border border-border"
      >
        <StationRows
          perfMode={perfMode}
          stations={stations}
          favoriteIds={favoriteSet}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          toggleFavorite={toggleFavorite}
          scrollRef={scrollRef}
        />
      </div>

      {/* The rows above are plain divs (absolutely positioned when
          virtualized), with no table semantics a screen reader can navigate
          by row/column. This real <table> gives assistive tech the same
          data — see docs/decisions/0005-accessibility.md. Favoriting isn't
          available from it yet; see docs/TECH_DEBT.md. */}
      <StationsTable stations={stations} />
    </Card>
  );
};
