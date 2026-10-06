"use client";

import {
  Bar,
  BarChart,
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
  CATEGORY_TICK,
  CHART_TOOLTIP_STYLE,
  GRID_STROKE,
  METRIC_COLORS,
  METRIC_LABELS,
} from "../../constants";
import type { Metric, VoivodeshipDatum } from "../../types";
import { formatTooltipNumber } from "../../utils/chart-format";
import { BreakdownTable } from "./breakdown-table";

type Props = {
  metric: Metric;
  year: number;
  breakdown: VoivodeshipDatum[];
};

/** One metric per voivodeship for a year, as bars plus the same numbers
 * in a table. */
export const BreakdownChart = ({ metric, year, breakdown }: Props) => {
  return (
    <Card>
      <h2 className="mb-3 text-base font-medium text-chart-ink">
        {METRIC_LABELS[metric]} wg województw, {year}
      </h2>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={breakdown} layout="vertical" margin={{ left: 8, right: 24, top: 8 }}>
          <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
          <XAxis type="number" stroke={AXIS_STROKE} tick={AXIS_TICK} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke={AXIS_STROKE}
            tick={CATEGORY_TICK}
            tickLine={false}
            axisLine={false}
            width={140}
          />
          <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={formatTooltipNumber} />
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
  );
};
