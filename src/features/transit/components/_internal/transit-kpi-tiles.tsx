import { useMemo } from "react";
import { Card } from "@/shared/ui/card";
import type { Vehicle } from "../../types";
import { formatAverageDelay } from "../../utils/format";
import { averageDelaySeconds, countRoutes } from "../../utils/vehicles";

/** Active vehicles, distinct routes and the fleet's average delay. */
export function TransitKpiTiles({ vehicles }: { vehicles: Vehicle[] }) {
  const routeCount = useMemo(() => countRoutes(vehicles), [vehicles]);
  const avgDelay = useMemo(() => averageDelaySeconds(vehicles), [vehicles]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Aktywne pojazdy</span>
        <span className="text-3xl font-semibold tabular-nums text-foreground">
          {vehicles.length}
        </span>
      </Card>
      <Card className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Linie</span>
        <span className="text-3xl font-semibold tabular-nums text-foreground">
          {routeCount}
        </span>
      </Card>
      <Card className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">
          Średnie opóźnienie
        </span>
        <span className="text-3xl font-semibold tabular-nums text-foreground">
          {formatAverageDelay(avgDelay)}
        </span>
      </Card>
    </div>
  );
}
