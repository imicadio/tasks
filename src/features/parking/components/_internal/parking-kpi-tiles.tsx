import { StatTile } from "@/shared/ui/stat-tile";
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
      <StatTile
        label="Parkingi bez wolnych miejsc"
        value={`${countFullLots(lots)} / ${lots.length}`}
      />
      <StatTile label="Wolne miejsca łącznie" value={totalFreeSpots(lots)} />
      <StatTile label="Ostatnia aktualizacja" value={formatTime(lastUpdate)} />
    </div>
  );
};
