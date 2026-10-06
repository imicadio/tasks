"use client";

import type { ChangeEvent } from "react";
import { cn } from "@/shared/utils/cn";
import { METRIC_LABELS, METRICS, YEARS_DESC } from "../../constants";
import type { Metric } from "../../types";

type Props = {
  metric: Metric;
  year: number;
  onMetricChange: (metric: Metric) => void;
  onYearChange: (year: number) => void;
  isLoading: boolean;
  error: string | null;
};

/** Metric switcher and the voivodeship chart's year picker. */
export const MetricFilters = ({
  metric,
  year,
  onMetricChange,
  onYearChange,
  isLoading,
  error,
}: Props) => {
  const handleMetricClick = (selected: Metric) => () => onMetricChange(selected);
  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) =>
    onYearChange(Number(event.target.value));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1 rounded-md border border-chart-baseline/40 p-1">
        {METRICS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={handleMetricClick(m)}
            aria-pressed={metric === m}
            className={cn(
              "rounded px-3 py-1.5 text-sm font-medium transition-colors",
              metric === m
                ? "bg-chart-ink text-chart-surface"
                : "text-chart-ink-secondary hover:bg-chart-baseline/20",
            )}
          >
            {METRIC_LABELS[m]}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-chart-ink-secondary">
        Rok (mapa województw):
        <select
          value={year}
          onChange={handleYearChange}
          className="rounded border border-chart-baseline/40 bg-chart-surface px-2 py-1.5 text-chart-ink"
        >
          {YEARS_DESC.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>

      {isLoading && <span className="text-sm text-chart-ink-secondary">Ładowanie…</span>}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
};
