"use client";

import { Badge } from "@/shared/ui/badge";
import { VEHICLE_TYPE_COLOR_VAR, VEHICLE_TYPE_LABELS } from "../constants";
import type { Vehicle, VehicleId } from "../types";
import { formatDelay } from "../utils/format";

type Props = {
  vehicles: Vehicle[];
  selectedVehicleId: VehicleId | null;
  onSelectVehicle: (id: VehicleId) => void;
};

export const VehicleList = ({ vehicles, selectedVehicleId, onSelectVehicle }: Props) => {
  const handleSelect = (id: VehicleId) => () => onSelectVehicle(id);

  return (
    <ul
      aria-label="Lista pojazdów"
      className="flex h-full flex-col divide-y divide-border overflow-y-auto"
    >
      {vehicles.length === 0 && (
        <li className="p-4 text-sm text-muted-foreground">
          Brak pojazdów spełniających filtr.
        </li>
      )}
      {vehicles.map((vehicle) => (
        <li key={vehicle.id}>
          <button
            type="button"
            onClick={handleSelect(vehicle.id)}
            aria-current={vehicle.id === selectedVehicleId ? "true" : undefined}
            className={`relative flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
              vehicle.id === selectedVehicleId ? "bg-accent" : ""
            }`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: VEHICLE_TYPE_COLOR_VAR[vehicle.vehicleType],
                }}
              />
              <Badge variant="outline" className="shrink-0 font-mono">
                {vehicle.routeShortName}
              </Badge>
              {/* The button is `relative` so this absolutely positioned
                  sr-only span stays anchored inside the scrolling list.
                  Without it, each span escapes the list's overflow clip
                  and the spans for rows far down stretch the page's
                  scroll height. */}
              <span className="sr-only">
                {VEHICLE_TYPE_LABELS[vehicle.vehicleType]}
              </span>
              <span className="truncate text-foreground">
                {vehicle.headsign || "—"}
              </span>
            </span>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {vehicle.speedKmh} km/h · {formatDelay(vehicle.delaySeconds)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};
