import type { ParkingSnapshot } from "../types";

/** Client-side fetch of every lot with its live free-spot count. */
export async function fetchParkingLots(): Promise<ParkingSnapshot> {
  const response = await fetch("/api/parking");
  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych o parkingach.");
  }
  return response.json();
}
