import { Card } from "@/shared/ui/card";
import type { ParkingLot } from "../../types";
import { formatTime } from "../../utils/format";
import { countFullLots, totalFreeSpots } from "../../utils/stats";

type Props = {
  lots: ParkingLot[];
  lastUpdate: string | null;
};

/** Full lots, total free spots and the feed's last update time. */
export const ParkingKpiTiles = ({ lots, lastUpdate }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">
          Parkingi bez wolnych miejsc
        </span>
        <span className="text-3xl font-semibold tabular-nums text-foreground">
          {countFullLots(lots)} / {lots.length}
        </span>
      </Card>
      <Card className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">
          Wolne miejsca łącznie
        </span>
        <span className="text-3xl font-semibold tabular-nums text-foreground">
          {totalFreeSpots(lots)}
        </span>
      </Card>
      <Card className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">
          Ostatnia aktualizacja
        </span>
        <span className="text-3xl font-semibold tabular-nums text-foreground">
          {formatTime(lastUpdate)}
        </span>
      </Card>
    </div>
  );
};
