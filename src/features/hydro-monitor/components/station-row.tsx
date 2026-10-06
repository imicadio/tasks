import { memo } from "react";
import { Star } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { STATUS_COLORS, STATUS_LABELS } from "../constants";
import type { HydroStation, StationId } from "../types";
import { formatCm } from "../utils/format-cm";
import { gaugePercent } from "../utils/gauge-percent";

export type StationRowProps = {
  station: HydroStation;
  isFavorite: boolean;
  isHovered: boolean;
  onHover: (id: StationId) => void;
  onToggleFavorite: (id: StationId) => void;
};

function StationRowImpl({
  station,
  isFavorite,
  isHovered,
  onHover,
  onToggleFavorite,
}: StationRowProps) {
  const gaugePct = gaugePercent(station);

  return (
    <div
      onMouseEnter={() => onHover(station.id)}
      className={`grid h-14 grid-cols-[auto_1.4fr_1fr_1.2fr_auto] items-center gap-3 border-b border-border px-3 text-sm transition-colors ${
        isHovered ? "bg-accent" : ""
      }`}
    >
      <button
        type="button"
        aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
        aria-pressed={isFavorite}
        onClick={() => onToggleFavorite(station.id)}
        className="text-muted-foreground hover:text-foreground"
      >
        <Star
          className="size-4"
          fill={isFavorite ? "var(--status-warning)" : "none"}
          stroke={isFavorite ? "var(--status-warning)" : "currentColor"}
        />
      </button>

      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">
          {station.name}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {station.river}
        </div>
      </div>

      <div className="truncate text-muted-foreground">
        {station.voivodeship}
      </div>

      <div className="flex flex-col gap-1">
        <span className="tabular-nums text-foreground">
          {formatCm(station.waterLevelCm)}
        </span>
        {gaugePct !== null && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{
                width: `${gaugePct}%`,
                backgroundColor: STATUS_COLORS[station.status],
              }}
            />
          </div>
        )}
      </div>

      {/* Pale tint stays as a decorative backdrop; the label itself stays
          in a fixed ink color rather than the status hue — several status
          colors (e.g. the warning yellow) fall well under WCAG's 3:1 floor
          for text at this size. The dot carries the color identity instead.
          See docs/decisions/0005-accessibility.md. */}
      <Badge
        variant="outline"
        style={{
          backgroundColor: `color-mix(in oklch, ${STATUS_COLORS[station.status]}, transparent 85%)`,
        }}
        className="border-0"
      >
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: STATUS_COLORS[station.status] }}
        />
        {STATUS_LABELS[station.status]}
      </Badge>
    </div>
  );
}

/** Optimized: skips re-rendering rows whose props haven't changed. */
export const StationRow = memo(StationRowImpl);

/** Naive: no memoization — re-renders on every parent render regardless of
 * whether this row's own props changed. Used only by the "naive mode" demo
 * toggle; see README.md. */
export const StationRowUnmemoized = StationRowImpl;
