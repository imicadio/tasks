import type { ValueOf } from "@/shared/types/value-of";
import type { AVAILABILITY_STATUS } from "../constants";

declare const parkingLotIdBrand: unique symbol;
export type ParkingLotId = string & { readonly [parkingLotIdBrand]: true };

export type AvailabilityStatus = ValueOf<typeof AVAILABILITY_STATUS>;

export type ParkingLot = {
  id: ParkingLotId;
  name: string;
  shortName: string;
  address: string;
  streetEntrance: string;
  lat: number;
  lon: number;
  /** Free-spot count as reported by the live feed; null only when the
   * feed has no entry for this lot. */
  availableSpots: number | null;
  /** Timestamp of that reading, if any. */
  availabilityUpdatedAt: string | null;
  status: AvailabilityStatus;
};

export type ParkingSnapshot = {
  lastUpdate: string;
  parkingLots: ParkingLot[];
};
