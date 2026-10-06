"use client";

import { useVehicleMarkers } from "../hooks/use-vehicle-markers";
import type { Vehicle, VehicleId } from "../types";

type Props = {
  vehicles: Vehicle[];
  selectedVehicleId: VehicleId | null;
  onSelectVehicle: (id: VehicleId) => void;
};

/** Renders nothing itself — it manages raw Leaflet markers on the map
 * imperatively; see useVehicleMarkers for why. */
export const VehicleMarkersLayer = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}: Props) => {
  useVehicleMarkers(vehicles, selectedVehicleId, onSelectVehicle);
  return null;
};
