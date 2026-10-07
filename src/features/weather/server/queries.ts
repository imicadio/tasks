import "server-only";
import { IMGW_SYNOP_URL, SORT_DIRECTION, WEATHER_SORT_FIELD } from "../constants";
import { weatherStationSchema, weatherStationsResponseSchema } from "../schemas";
import type { WeatherStation, WeatherStationsParams } from "../types";

export async function getWeatherStations(): Promise<WeatherStation[]> {
  const response = await fetch(IMGW_SYNOP_URL, { next: { revalidate: 300 } });

  if (!response.ok) {
    throw new Error(
      `IMGW synop request failed: ${response.status} ${response.statusText}`,
    );
  }

  return weatherStationsResponseSchema.parse(await response.json());
}

/**
 * IMGW's single-station lookup (`/synop/id/{id}`) is a genuinely different
 * endpoint from the list one, not just the list filtered down — it returns
 * one JSON object (not an array), it 404s outright for an unknown id rather
 * than returning an empty body, and every field (including id_stacji,
 * normally a number on the list endpoint) comes back as a string. The same
 * `weatherStationSchema` handles this fine, since its underlying field
 * schemas already coerce string-or-number input — see
 * docs/decisions/0003-api-data-validation.md.
 */
export async function getWeatherStationById(
  id: string,
): Promise<WeatherStation | null> {
  const response = await fetch(
    `${IMGW_SYNOP_URL}/id/${encodeURIComponent(id)}`,
    { next: { revalidate: 300 } },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(
      `IMGW synop request failed: ${response.status} ${response.statusText}`,
    );
  }

  return weatherStationSchema.parse(await response.json());
}

export function filterAndSortWeatherStations(
  stations: WeatherStation[],
  options: WeatherStationsParams,
): WeatherStation[] {
  const { q, sort, dir } = options;
  const needle = q.toLowerCase();

  const filtered = q
    ? stations.filter((s) => s.name.toLowerCase().includes(needle))
    : stations;

  const sorted = [...filtered].sort((a, b) => {
    let comparison: number;
    switch (sort) {
      case WEATHER_SORT_FIELD.Name:
        comparison = a.name.localeCompare(b.name, "pl");
        break;
      case WEATHER_SORT_FIELD.Temperature:
        comparison = (a.temperatureC ?? -Infinity) - (b.temperatureC ?? -Infinity);
        break;
      case WEATHER_SORT_FIELD.WindSpeed:
        comparison = (a.windSpeedMs ?? -Infinity) - (b.windSpeedMs ?? -Infinity);
        break;
      default: {
        const exhaustive: never = sort;
        throw new Error(`Unhandled sort field: ${exhaustive}`);
      }
    }
    return dir === SORT_DIRECTION.Asc ? comparison : -comparison;
  });

  return sorted;
}
