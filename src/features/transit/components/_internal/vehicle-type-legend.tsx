import {
  VEHICLE_TYPE_COLOR_VAR,
  VEHICLE_TYPE_LABELS,
  VEHICLE_TYPES,
} from "../../constants";
import type { Vehicle } from "../../types";
import { visibleVehicleTypes } from "../../utils/vehicles";

/** Color key for the map markers and list dots. */
export const VehicleTypeLegend = ({ vehicles }: { vehicles: Vehicle[] }) => {
  return (
    <ul className="flex items-center gap-4 text-sm text-muted-foreground">
      {visibleVehicleTypes(VEHICLE_TYPES, vehicles).map((type) => (
        <li key={type} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: VEHICLE_TYPE_COLOR_VAR[type] }}
          />
          {VEHICLE_TYPE_LABELS[type]}
        </li>
      ))}
    </ul>
  );
};
