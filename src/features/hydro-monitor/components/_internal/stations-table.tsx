import { STATUS_LABELS } from "../../constants";
import type { HydroStation } from "../../types";

/** Screen-reader-only table of the visible stations — see the comment
 * where it's rendered in hydro-monitor-dashboard.tsx. */
export const StationsTable = ({ stations }: { stations: HydroStation[] }) => {
  // `sr-only` sits on a wrapper div, not on the <table> itself: tables size
  // to their content and ignore `width/height: 1px`, so the hidden table
  // stayed ~22000px tall and stretched the page's scroll area. A
  // block-level div honors the 1px box and clips it.
  return (
    <div className="sr-only">
      <table>
        <caption>
          Stacje wodowskazowe, {stations.length} wyników
        </caption>
        <thead>
          <tr>
            <th scope="col">Stacja</th>
            <th scope="col">Rzeka</th>
            <th scope="col">Województwo</th>
            <th scope="col">Stan wody</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <tr key={station.id}>
              <td>{station.name}</td>
              <td>{station.river}</td>
              <td>{station.voivodeship}</td>
              <td>
                {station.waterLevelCm === null
                  ? "brak danych"
                  : `${station.waterLevelCm} cm`}
              </td>
              <td>{STATUS_LABELS[station.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
