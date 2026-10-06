import { MapPin } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";
import { MISSING_VALUE } from "../../constants";
import type { ParkingLot } from "../../types";
import { formatDateTime } from "../../utils/format";
import { AvailabilityBadge } from "../availability-badge";
import { SpotsCount } from "./spots-count";

type Props = {
  lot: ParkingLot;
  selected: boolean;
  onShowOnMap: () => void;
};

/** One parking lot's row, with a button that selects it on the map. */
export const ParkingRow = ({ lot, selected, onShowOnMap }: Props) => {
  return (
    <tr className={cn("border-b border-border last:border-b-0", selected && "bg-accent")}>
      <td className="px-3 py-2 font-mono">{lot.shortName}</td>
      <th scope="row" className="px-3 py-2 text-left font-medium text-foreground">
        {lot.name}
        <span className="block text-xs font-normal text-muted-foreground">
          {lot.address}
        </span>
      </th>
      <td className="px-3 py-2">{lot.streetEntrance || MISSING_VALUE}</td>
      <td className="px-3 py-2 text-right tabular-nums">
        <SpotsCount spots={lot.availableSpots} />
      </td>
      <td className="px-3 py-2">
        <AvailabilityBadge status={lot.status} />
      </td>
      <td className="px-3 py-2 whitespace-nowrap tabular-nums text-muted-foreground">
        {formatDateTime(lot.availabilityUpdatedAt)}
      </td>
      <td className="px-3 py-2 text-right">
        <Button
          type="button"
          variant="ghost"
          onClick={onShowOnMap}
          aria-pressed={selected}
          aria-label={`Pokaż na mapie: ${lot.name}`}
        >
          <MapPin aria-hidden="true" />
          Mapa
        </Button>
      </td>
    </tr>
  );
};
