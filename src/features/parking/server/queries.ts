import "server-only";
import {
  FEW_SPOTS_THRESHOLD,
  PARKING_AVAILABILITY_URL,
  PARKING_LOTS_URL,
} from "../constants";
import {
  rawParkingAvailabilitySchema,
  rawParkingLotsSchema,
} from "../schemas";
import type { RawParkingAvailability, RawParkingLots } from "../schemas";
import type {
  AvailabilityStatus,
  ParkingLot,
  ParkingLotId,
  ParkingSnapshot,
} from "../types";

async function fetchJson(url: string, revalidate: number): Promise<unknown> {
  const response = await fetch(url, { next: { revalidate } });
  if (!response.ok) {
    throw new Error(
      `Parking request failed (${url}): ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}

export async function getParkingLots(): Promise<ParkingSnapshot> {
  const [lots, availability] = await Promise.all([
    // Lot metadata changes rarely (the file itself is regenerated daily).
    fetchJson(PARKING_LOTS_URL, 3600).then((json) =>
      rawParkingLotsSchema.parse(json),
    ),
    // Short cache, matching the source's own 30s `Expires`: every viewer
    // polls /api/parking, and this keeps that to at most one upstream
    // request per 30s regardless of how many are watching.
    fetchJson(PARKING_AVAILABILITY_URL, 30).then((json) =>
      rawParkingAvailabilitySchema.parse(json),
    ),
  ]);

  return {
    lastUpdate: availability.lastUpdate,
    parkingLots: joinAvailability(lots, availability),
  };
}

export function availabilityStatus(spots: number | null): AvailabilityStatus {
  if (spots === null) return "unknown";
  if (spots <= 0) return "full";
  if (spots < FEW_SPOTS_THRESHOLD) return "few";
  return "available";
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
