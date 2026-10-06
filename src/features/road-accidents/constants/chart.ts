import type { CSSProperties } from "react";

/** Shared look of every Recharts tooltip on the dashboard. */
export const CHART_TOOLTIP_STYLE: CSSProperties = {
  background: "var(--chart-surface)",
  border: "1px solid var(--chart-baseline)",
  borderRadius: 6,
  fontSize: 13,
  color: "var(--chart-ink)",
};
