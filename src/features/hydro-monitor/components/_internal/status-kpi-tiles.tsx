import { STATUS_COLORS, STATUS_KPI_ORDER, STATUS_LABELS } from "../../constants";
import type { StationStatus, StatusCounts, StatusFilter } from "../../types";
import { StatTile } from "@/shared/ui/stat-tile";
import { cn } from "@/shared/utils/cn";

type Props = {
  counts: StatusCounts;
  activeStatus: StatusFilter;
  onSelect: (status: StationStatus) => void;
};

/** One tile per status with its station count; clicking a tile filters
 * the list to that status. */
export const StatusKpiTiles = ({ counts, activeStatus, onSelect }: Props) => {
  const handleSelect = (status: StationStatus) => () => onSelect(status);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {STATUS_KPI_ORDER.map((s) => (
        <button
          key={s}
          type="button"
          onClick={handleSelect(s)}
          aria-pressed={activeStatus === s}
        >
          <StatTile
            label={STATUS_LABELS[s]}
            value={counts[s]}
            dotColor={STATUS_COLORS[s]}
            className={cn("transition-shadow", activeStatus === s && "ring-2 ring-ring")}
          />
        </button>
      ))}
    </div>
  );
};
