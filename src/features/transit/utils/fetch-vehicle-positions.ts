import type { VehiclesSnapshot } from "../types";

/** Client-side fetch of the current positions, optionally filtered by route. */
export async function fetchVehiclePositions(route: string): Promise<VehiclesSnapshot> {
  const search = new URLSearchParams(route ? { route } : {});
  const response = await fetch(`/api/transit?${search.toString()}`);
  if (!response.ok) {
    throw new Error("Nie udało się pobrać pozycji pojazdów.");
  }
  return response.json();
}
