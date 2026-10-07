import { AVAILABILITY_STATUS, FEW_SPOTS_THRESHOLD } from "../constants";
import type { RawParkingAvailability, RawParkingLots } from "../schemas";
import type { AvailabilityStatus, ParkingLot, ParkingLotId } from "../types";

/** Free-spot count → status; see FEW_SPOTS_THRESHOLD. */
export function availabilityStatus(spots: number | null): AvailabilityStatus {
  if (spots === null) return AVAILABILITY_STATUS.Unknown;
  if (spots <= 0) return AVAILABILITY_STATUS.Full;
  if (spots < FEW_SPOTS_THRESHOLD) return AVAILABILITY_STATUS.Few;
  return AVAILABILITY_STATUS.Available;
}

/** Joins lot metadata with live counts on `id === parkingId`. Lots without
 * coordinates are dropped — they can't be placed on the map, and
 * fabricating a position would be worse than omitting them. */
export function joinAvailability(
  lots: RawParkingLots,
  availability: RawParkingAvailability,
): ParkingLot[] {
  const byId = new Map(
    availability.parkingLots.map((entry) => [entry.parkingId, entry]),
  );

  return lots.parkingLots
    .flatMap((lot): ParkingLot[] => {
      const { latitude, longitude } = lot.location;
      if (latitude === null || longitude === null) return [];
      const live = byId.get(lot.id);
      const spots = live?.availableSpots ?? null;
      return [
        {
          id: lot.id as ParkingLotId,
          name: lot.name,
          shortName: lot.shortName,
          address: lot.address,
          streetEntrance: lot.streetEntrance,
          lat: latitude,
          lon: longitude,
          availableSpots: spots,
          availabilityUpdatedAt: live?.lastUpdate ?? null,
          status: availabilityStatus(spots),
        },
      ];
    })
    .sort((a, b) =>
      a.shortName.localeCompare(b.shortName, "pl", { numeric: true }),
    );
}
