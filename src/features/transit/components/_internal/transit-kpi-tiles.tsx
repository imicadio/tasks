import { useMemo } from "react";
import { StatTile } from "@/shared/ui/stat-tile";
import type { Vehicle } from "../../types";
import { formatAverageDelay } from "../../utils/format";
import { averageDelaySeconds, countRoutes } from "../../utils/vehicles";

/** Active vehicles, distinct routes and the fleet's average delay. */
export const TransitKpiTiles = ({ vehicles }: { vehicles: Vehicle[] }) => {
  const routeCount = useMemo(() => countRoutes(vehicles), [vehicles]);
  const avgDelay = useMemo(() => averageDelaySeconds(vehicles), [vehicles]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatTile label="Aktywne pojazdy" value={vehicles.length} />
      <StatTile label="Linie" value={routeCount} />
      <StatTile label="Średnie opóźnienie" value={formatAverageDelay(avgDelay)} />
    </div>
  );
};
