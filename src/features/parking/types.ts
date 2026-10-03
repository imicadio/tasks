declare const parkingLotIdBrand: unique symbol;
export type ParkingLotId = string & { readonly [parkingLotIdBrand]: true };

/** "unknown" covers both a lot missing from the live feed and one whose
 * last reading is older than STALE_AFTER_MS — see constants.ts. */
export type AvailabilityStatus = "available" | "few" | "full" | "unknown";

export type ParkingLot = {
  id: ParkingLotId;
  name: string;
  shortName: string;
  address: string;
  streetEntrance: string;
  lat: number;
  lon: number;
  /** Last reported free-spot count, even if stale; null when the live feed
   * has no entry for this lot. Check `status` before presenting it as
   * current. */
  availableSpots: number | null;
  /** Timestamp of that reading, if any. */
  availabilityUpdatedAt: string | null;
  status: AvailabilityStatus;
};

export type ParkingSnapshot = {
  lastUpdate: string;
  parkingLots: ParkingLot[];
};
