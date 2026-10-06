import type { RawNominatimReverse } from "../schemas";

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
