import type { VoivodeshipDatum } from "../../types";
import { formatNumber } from "../../utils/format-number";

export function BreakdownTable({
  data,
  metricLabel,
}: {
  data: VoivodeshipDatum[];
  metricLabel: string;
}) {
  return (
    <table className="mt-4 w-full text-left text-sm">
      <caption className="sr-only">
        Dane liczbowe: {metricLabel} wg województw
      </caption>
      <thead>
        <tr className="border-b border-chart-grid text-chart-ink-secondary">
          <th scope="col" className="py-1.5 font-medium">
            Województwo
          </th>
          <th scope="col" className="py-1.5 text-right font-medium">
            {metricLabel}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="border-b border-chart-grid/60">
            <td className="py-1.5 text-chart-ink">{row.name}</td>
            <td className="py-1.5 text-right tabular-nums text-chart-ink">
              {formatNumber(row.value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
