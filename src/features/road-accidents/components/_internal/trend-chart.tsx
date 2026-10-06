"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/shared/ui/card";
import {
  AXIS_STROKE,
  AXIS_TICK,
  CHART_TOOLTIP_STYLE,
  GRID_STROKE,
  MAX_YEAR,
  METRIC_COLORS,
  METRIC_LABELS,
  MIN_YEAR,
} from "../../constants";
import type { Metric, YearDatum } from "../../types";
import { formatTooltipNumber, formatYearLabel } from "../../utils/chart-format";

type Props = {
  metric: Metric;
  trend: YearDatum[];
};

/** National yearly values of one metric as an area chart. */
export const TrendChart = ({ metric, trend }: Props) => {
  return (
    <Card>
      <h2 className="mb-3 text-base font-medium text-chart-ink">
        {METRIC_LABELS[metric]} w Polsce, {MIN_YEAR}–{MAX_YEAR}
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={trend} margin={{ left: 0, right: 8, top: 8 }}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis
            dataKey="year"
            stroke={AXIS_STROKE}
            tick={AXIS_TICK}
            tickLine={false}
            interval={2}
          />
          <YAxis
            stroke={AXIS_STROKE}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            contentStyle={CHART_TOOLTIP_STYLE}
            formatter={formatTooltipNumber}
            labelFormatter={formatYearLabel}
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
  );
};
