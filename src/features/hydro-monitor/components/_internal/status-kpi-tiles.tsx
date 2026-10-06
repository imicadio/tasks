import { STATUS_COLORS, STATUS_KPI_ORDER, STATUS_LABELS } from "../../constants";
import type { StationStatus, StatusCounts, StatusFilter } from "../../types";
import { Card } from "@/shared/ui/card";

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
          <Card
            className={`flex flex-col gap-1 text-left transition-shadow ${
              activeStatus === s ? "ring-2 ring-ring" : ""
            }`}
          >
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[s] }}
              />
              {STATUS_LABELS[s]}
            </span>
            {/* Ink text, not the status accent — see
                docs/decisions/0005-accessibility.md (the warning hue alone
                is 1.79:1 on this surface, well under WCAG's 3:1 floor for
                large text). The dot above carries the color identity. */}
            <span className="text-3xl font-semibold tabular-nums text-foreground">
              {counts[s]}
            </span>
          </Card>
        </button>
      ))}
    </div>
  );
};
