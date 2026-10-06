import { useMemo } from "react";
import { Marker, Tooltip } from "react-leaflet";
import type { ParkingLot, ParkingLotId } from "../../types";
import { formatLotName } from "../../utils/format";
import { createLotIcon } from "../../utils/marker-icon";

/** One lot's map marker, labelled with its free-spot count. */
export function LotMarker({
  lot,
  selected,
  onSelect,
}: {
  lot: ParkingLot;
  selected: boolean;
  onSelect: (id: ParkingLotId) => void;
}) {
  const icon = useMemo(() => createLotIcon(lot, selected), [lot, selected]);
  return (
    <Marker
      position={[lot.lat, lot.lon]}
      icon={icon}
      eventHandlers={{ click: () => onSelect(lot.id) }}
      zIndexOffset={selected ? 1000 : 0}
    >
      <Tooltip>{formatLotName(lot)}</Tooltip>
    </Marker>
  );
}
