import type { HydroStation } from "../types";

/** Every voivodeship that has at least one station, in Polish alphabetical order. */
export function listVoivodeships(stations: HydroStation[]): string[] {
  const unique = new Set(stations.map((station) => station.voivodeship));
  return [...unique].sort((a, b) => a.localeCompare(b, "pl"));
}
