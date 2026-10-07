import { MAX_YEAR, METRIC_COLORS, METRIC_LABELS, METRICS } from "../../constants";
import type { LatestByMetric } from "../../types";
import { formatNumber } from "../../utils/format-number";
import { StatTile } from "@/shared/ui/stat-tile";

type Props = { latest: LatestByMetric };

export const KpiRow = ({ latest }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {METRICS.map((m) => (
        <StatTile
          key={m}
          label={`${METRIC_LABELS[m]} (${MAX_YEAR})`}
          value={formatNumber(latest[m])}
          dotColor={METRIC_COLORS[m]}
        />
      ))}
    </div>
  );
};
