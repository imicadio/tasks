import type { GeocodeResult } from "../types";

/** Client-side lookup of a point's street address through our cached
 * geocode route (never Nominatim directly — see constants/geocode.ts). */
export async function fetchAddress(lat: number, lon: number): Promise<GeocodeResult> {
  const response = await fetch(`/api/incident-report/geocode?lat=${lat}&lon=${lon}`);
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}
