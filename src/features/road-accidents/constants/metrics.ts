import type { Metric } from "../types";

export const METRIC = {
  Accidents: "accidents",
  Fatalities: "fatalities",
  Injured: "injured",
} as const;

export const METRICS: Metric[] = Object.values(METRIC);

/** The metric the dashboard opens on. */
export const DEFAULT_METRIC: Metric = METRIC.Accidents;

export const METRIC_LABELS: Record<Metric, string> = {
  [METRIC.Accidents]: "Wypadki",
  [METRIC.Fatalities]: "Ofiary śmiertelne",
  [METRIC.Injured]: "Ranni",
};

export const METRIC_COLORS: Record<Metric, string> = {
  [METRIC.Accidents]: "var(--metric-accidents)",
  [METRIC.Fatalities]: "var(--metric-fatalities)",
  [METRIC.Injured]: "var(--metric-injured)",
};
