"use client";

import { DEFAULT_METRIC, MAX_YEAR, MIN_YEAR } from "../constants";
import { useRoadAccidents } from "../hooks/use-road-accidents";
import type { LatestByMetric, VoivodeshipDatum, YearDatum } from "../types";
import { BreakdownChart } from "./_internal/breakdown-chart";
import { KpiRow } from "./_internal/kpi-row";
import { MetricFilters } from "./_internal/metric-filters";
import { TrendChart } from "./_internal/trend-chart";

type Props = {
  initialTrend: YearDatum[];
  initialBreakdown: VoivodeshipDatum[];
  initialLatest: LatestByMetric;
};

export const RoadAccidentsDashboard = ({
  initialTrend,
  initialBreakdown,
  initialLatest,
}: Props) => {
  const { metric, setMetric, year, setYear, trend, breakdown, isLoading, error } =
    useRoadAccidents({
      metric: DEFAULT_METRIC,
      year: MAX_YEAR,
      trend: initialTrend,
      breakdown: initialBreakdown,
    });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-chart-ink">
          Wypadki drogowe w Polsce
        </h1>
        <p className="text-sm text-chart-ink-secondary">
          Źródło: GUS Bank Danych Lokalnych (bdl.stat.gov.pl), dane {MIN_YEAR}–{MAX_YEAR}.
        </p>
      </header>

      <KpiRow latest={initialLatest} />
      <MetricFilters
        metric={metric}
        year={year}
        onMetricChange={setMetric}
        onYearChange={setYear}
        isLoading={isLoading}
        error={error}
      />
      <TrendChart metric={metric} trend={trend} />
      <BreakdownChart metric={metric} year={year} breakdown={breakdown} />
    </div>
  );
};
