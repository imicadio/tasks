import "server-only";
import { PARKING_AVAILABILITY_URL, PARKING_LOTS_URL } from "../constants";
import {
  rawParkingAvailabilitySchema,
  rawParkingLotsSchema,
} from "../schemas";
import type { ParkingSnapshot } from "../types";
import { joinAvailability } from "../utils/availability";

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
