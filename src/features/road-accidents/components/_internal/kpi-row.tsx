import { MAX_YEAR, METRIC_COLORS, METRIC_LABELS, METRICS } from "../../constants";
import type { LatestByMetric } from "../../types";
import { formatNumber } from "../../utils/format-number";
import { Card } from "@/shared/ui/card";

export function KpiRow({ latest }: { latest: LatestByMetric }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {METRICS.map((m) => (
        <Card key={m} className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-sm text-chart-ink-secondary">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: METRIC_COLORS[m] }}
            />
            {METRIC_LABELS[m]} ({MAX_YEAR})
          </span>
          {/* Text stays in a fixed ink color rather than the metric accent —
              several of those accents (e.g. the aqua "injured" color) fall
              well below WCAG's 3:1 contrast floor for large text when used
              as text instead of a chart mark. The dot above carries the
              color identity instead. See docs/decisions/0005-accessibility.md. */}
          <span className="text-3xl font-semibold tabular-nums text-chart-ink">
            {formatNumber(latest[m])}
          </span>
        </Card>
      ))}
    </div>
  );
}
