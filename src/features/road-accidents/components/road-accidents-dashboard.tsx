"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_TOOLTIP_STYLE,
  DEFAULT_METRIC,
  MAX_YEAR,
  METRIC_COLORS,
  METRIC_LABELS,
  METRICS,
  MIN_YEAR,
  YEARS_DESC,
} from "../constants";
import { useRoadAccidents } from "../hooks/use-road-accidents";
import type { LatestByMetric, VoivodeshipDatum, YearDatum } from "../types";
import { formatNumber } from "../utils/format-number";
import { BreakdownTable } from "./_internal/breakdown-table";
import { KpiRow } from "./_internal/kpi-row";
import { Card } from "@/shared/ui/card";

export const RoadAccidentsDashboard = ({
  initialTrend,
  initialBreakdown,
  initialLatest,
}: {
  initialTrend: YearDatum[];
  initialBreakdown: VoivodeshipDatum[];
  initialLatest: LatestByMetric;
}) => {
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
          Źródło: GUS Bank Danych Lokalnych (bdl.stat.gov.pl), dane{" "}
          {MIN_YEAR}–{MAX_YEAR}.
        </p>
      </header>

      <KpiRow latest={initialLatest} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-md border border-chart-baseline/40 p-1">
          {METRICS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMetric(m)}
              aria-pressed={metric === m}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                metric === m
                  ? "bg-chart-ink text-chart-surface"
                  : "text-chart-ink-secondary hover:bg-chart-baseline/20"
              }`}
            >
              {METRIC_LABELS[m]}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-chart-ink-secondary">
          Rok (mapa województw):
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded border border-chart-baseline/40 bg-chart-surface px-2 py-1.5 text-chart-ink"
          >
            {YEARS_DESC.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        {isLoading && (
          <span className="text-sm text-chart-ink-secondary">
            Ładowanie…
          </span>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      <Card>
        <h2 className="mb-3 text-base font-medium text-chart-ink">
          {METRIC_LABELS[metric]} w Polsce, {MIN_YEAR}–{MAX_YEAR}
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trend} margin={{ left: 0, right: 8, top: 8 }}>
            <CartesianGrid
              stroke="var(--chart-grid)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              stroke="var(--chart-baseline)"
              tick={{ fill: "var(--chart-muted)", fontSize: 12 }}
              tickLine={false}
              interval={2}
            />
            <YAxis
              stroke="var(--chart-baseline)"
              tick={{ fill: "var(--chart-muted)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={48}
            />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(value) => formatNumber(typeof value === "number" ? value : null)}
              labelFormatter={(label) => `Rok ${label}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              name={METRIC_LABELS[metric]}
              stroke={METRIC_COLORS[metric]}
              fill={METRIC_COLORS[metric]}
              fillOpacity={0.15}
              strokeWidth={2}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-medium text-chart-ink">
          {METRIC_LABELS[metric]} wg województw, {year}
        </h2>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            data={breakdown}
            layout="vertical"
            margin={{ left: 8, right: 24, top: 8 }}
          >
            <CartesianGrid stroke="var(--chart-grid)" horizontal={false} />
            <XAxis
              type="number"
              stroke="var(--chart-baseline)"
              tick={{ fill: "var(--chart-muted)", fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="var(--chart-baseline)"
              tick={{ fill: "var(--chart-ink-secondary)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={140}
            />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(value) => formatNumber(typeof value === "number" ? value : null)}
            />
            <Bar
              dataKey="value"
              name={METRIC_LABELS[metric]}
              fill={METRIC_COLORS[metric]}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <BreakdownTable data={breakdown} metricLabel={METRIC_LABELS[metric]} />
      </Card>
    </div>
  );
};
