import { Card } from "@/shared/ui/card";
import type { WeatherStation } from "../../types";
import { StationTableRow } from "./station-table-row";

/** Every station's current readings, one row each. */
export const StationsTable = ({ stations }: { stations: WeatherStation[] }) => {
  return (
    <Card>
      <table className="w-full text-left text-sm">
        <caption className="sr-only">
          Stacje pogodowe, {stations.length} wyników
        </caption>
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th scope="col" className="py-1.5 font-medium">
              Stacja
            </th>
            <th scope="col" className="py-1.5 text-right font-medium">
              Temperatura
            </th>
            <th scope="col" className="py-1.5 text-right font-medium">
              Wiatr
            </th>
            <th scope="col" className="py-1.5 text-right font-medium">
              Wilgotność
            </th>
            <th scope="col" className="py-1.5 text-right font-medium">
              Ciśnienie
            </th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <StationTableRow key={station.id} station={station} />
          ))}
        </tbody>
      </table>
    </Card>
  );
};
