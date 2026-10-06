"use client";

import type { ParkingLot, ParkingLotId } from "../types";
import { ParkingRow } from "./_internal/parking-row";

/**
 * The primary, fully keyboard- and screen-reader-accessible view of the
 * data: everything the map shows is here too, as a native <table> with a
 * caption and scoped headers. The map is a visual complement, not the only
 * way to get at a lot's numbers.
 */
export const ParkingTable = ({
  lots,
  selectedLotId,
  onSelectLot,
}: {
  lots: ParkingLot[];
  selectedLotId: ParkingLotId | null;
  onSelectLot: (id: ParkingLotId) => void;
}) => {
  const handleShowOnMap = (id: ParkingLotId) => () => onSelectLot(id);

  return (
    // Focusable scroll container: on narrow screens the table scrolls
    // horizontally, and keyboard users must be able to reach that scroll
    // (WCAG 2.1.1 / axe "scrollable-region-focusable").
    <div
      role="region"
      aria-labelledby="parking-table-caption"
      tabIndex={0}
      className="overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption
          id="parking-table-caption"
          className="px-3 pb-2 text-left text-sm text-muted-foreground"
        >
          Parkingi w Gdańsku i liczba wolnych miejsc ({lots.length})
        </caption>
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th scope="col" className="px-3 py-2 font-medium">
              Kod
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Parking
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Wjazd
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              Wolne miejsca
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Status
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Odczyt
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              <span className="sr-only">Akcje</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {lots.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-4 text-muted-foreground">
                Brak danych o parkingach.
              </td>
            </tr>
          )}
          {lots.map((lot) => (
            <ParkingRow
              key={lot.id}
              lot={lot}
              selected={lot.id === selectedLotId}
              onShowOnMap={handleShowOnMap(lot.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
