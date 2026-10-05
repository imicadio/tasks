import "server-only";
import {
  GEOCODE_REVALIDATE_S,
  GEOCODE_USER_AGENT,
  NOMINATIM_REVERSE_URL,
} from "../constants";
import { rawNominatimReverseSchema, type RawNominatimReverse } from "../schemas";
import type { GeocodeResult } from "../types";

/** Reverse-geocodes a point in Gdańsk to a short street address. Returns
 * `{ address: null }` when OSM has nothing there (e.g. open water). */
export async function reverseGeocode(lat: number, lon: number): Promise<GeocodeResult> {
  const url = new URL(NOMINATIM_REVERSE_URL);
  url.search = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lon),
    zoom: "18",
    addressdetails: "1",
    "accept-language": "pl",
  }).toString();

  const response = await fetch(url, {
    headers: { "User-Agent": GEOCODE_USER_AGENT },
    next: { revalidate: GEOCODE_REVALIDATE_S },
  });
  if (!response.ok) {
    throw new Error(`Reverse geocoding failed: ${response.status} ${response.statusText}`);
  }
  const raw = rawNominatimReverseSchema.parse(await response.json());
  return { address: formatNominatimAddress(raw) };
}

/** "Długa 45, Śródmieście". Falls back to the place's name, then to the
 * first parts of `display_name`. */
export function formatNominatimAddress(raw: RawNominatimReverse): string | null {
  if (raw.error) return null;
  const a = raw.address ?? {};
  const street = a.road ?? a.pedestrian ?? a.footway;
  const area = a.suburb ?? a.quarter;
  if (street) {
    const line = a.house_number ? `${street} ${a.house_number}` : street;
    return area ? `${line}, ${area}` : line;
  }
  if (raw.name) return area ? `${raw.name}, ${area}` : raw.name;
  if (raw.display_name) return raw.display_name.split(", ").slice(0, 3).join(", ");
  return null;
}
