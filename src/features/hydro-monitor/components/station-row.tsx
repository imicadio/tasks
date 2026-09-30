import { memo } from "react";
import { Star } from "lucide-react";
import { useRenderCount } from "@/shared/hooks/use-render-count";
import { Badge } from "@/shared/ui/badge";
import { STATUS_COLORS, STATUS_LABELS } from "../constants";
import type { HydroStation, StationId } from "../types";

export type StationRowProps = {
  station: HydroStation;
  isFavorite: boolean;
  isHovered: boolean;
  onHover: (id: StationId) => void;
  onToggleFavorite: (id: StationId) => void;
  /** Shows a live render counter — see the perf case study in README.md. */
  showRenderCount: boolean;
};

function formatCm(value: number | null): string {
  return value === null ? "—" : `${value} cm`;
}

function StationRowImpl({
  station,
  isFavorite,
  isHovered,
  onHover,
  onToggleFavorite,
  showRenderCount,
}: StationRowProps) {
  const renderCount = useRenderCount();
  const gaugeMax = station.alarmLevelCm ?? station.warningLevelCm ?? null;
  const gaugePct =
    gaugeMax && station.waterLevelCm !== null
      ? Math.min(100, Math.round((station.waterLevelCm / gaugeMax) * 100))
      : null;

  return (
    <div
      onMouseEnter={() => onHover(station.id)}
      className={`grid h-14 grid-cols-[auto_1.4fr_1fr_1.2fr_auto_auto] items-center gap-3 border-b border-border px-3 text-sm transition-colors ${
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

      <Badge
        style={{
          backgroundColor: `color-mix(in oklch, ${STATUS_COLORS[station.status]}, transparent 85%)`,
          color: STATUS_COLORS[station.status],
        }}
        className="border-0"
      >
        {STATUS_LABELS[station.status]}
      </Badge>

      {showRenderCount && (
        <span
          className="justify-self-end font-mono text-xs text-muted-foreground"
          title="Liczba renderów tego wiersza — patrz README.md (case study wydajności)"
        >
          {renderCount}
        </span>
      )}
    </div>
  );
}

/** Optimized: skips re-rendering rows whose props haven't changed. */
export const StationRow = memo(StationRowImpl);

/** Naive: no memoization — re-renders on every parent render regardless of
 * whether this row's own props changed. Used only by the "naive mode" demo
 * toggle; see README.md. */
export const StationRowUnmemoized = StationRowImpl;
