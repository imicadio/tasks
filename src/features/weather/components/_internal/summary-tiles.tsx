import type { WeatherSummary } from "../../types";
import { formatTemp, formatTempAtStation } from "../../utils/format";
import { Card } from "@/shared/ui/card";

/** Average, warmest and coldest temperature across all stations. */
export const SummaryTiles = ({ summary }: { summary: WeatherSummary }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">
          Średnia temperatura
        </span>
        <span className="text-3xl font-semibold tabular-nums text-primary">
          {formatTemp(summary.avgTemperatureC)}
        </span>
      </Card>
      <Card className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Najcieplej</span>
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          {formatTempAtStation(summary.warmest)}
        </span>
      </Card>
      <Card className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Najzimniej</span>
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          {formatTempAtStation(summary.coldest)}
        </span>
      </Card>
    </div>
  );
};
