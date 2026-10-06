import type { Metric } from "../types";

export const METRICS: Metric[] = ["accidents", "fatalities", "injured"];

/** The metric the dashboard opens on. */
export const DEFAULT_METRIC: Metric = "accidents";

export const METRIC_LABELS: Record<Metric, string> = {
  accidents: "Wypadki",
  fatalities: "Ofiary śmiertelne",
  injured: "Ranni",
};

export const METRIC_COLORS: Record<Metric, string> = {
  accidents: "var(--metric-accidents)",
  fatalities: "var(--metric-fatalities)",
  injured: "var(--metric-injured)",
};
