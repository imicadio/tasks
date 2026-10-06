import type { CSSProperties } from "react";

/** Shared look of every Recharts tooltip on the dashboard. */
export const CHART_TOOLTIP_STYLE: CSSProperties = {
  background: "var(--chart-surface)",
  border: "1px solid var(--chart-baseline)",
  borderRadius: 6,
  fontSize: 13,
  color: "var(--chart-ink)",
};

export const AXIS_STROKE = "var(--chart-baseline)";
export const GRID_STROKE = "var(--chart-grid)";

/** Tick labels on value axes. */
export const AXIS_TICK = { fill: "var(--chart-muted)", fontSize: 12 };

/** Tick labels on the voivodeship axis — darker, since they're names. */
export const CATEGORY_TICK = { fill: "var(--chart-ink-secondary)", fontSize: 12 };
