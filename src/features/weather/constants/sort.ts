import type { WeatherSortField } from "../types";

export const WEATHER_SORT_FIELD = {
  Temperature: "temperatureC",
  WindSpeed: "windSpeedMs",
  Name: "name",
} as const;

export const SORT_LABELS: Record<WeatherSortField, string> = {
  [WEATHER_SORT_FIELD.Temperature]: "Sortuj: temperatura",
  [WEATHER_SORT_FIELD.WindSpeed]: "Sortuj: wiatr",
  [WEATHER_SORT_FIELD.Name]: "Sortuj: nazwa",
};

export { DIR_LABELS, SORT_DIRECTION, SORT_DIRECTIONS } from "@/shared/constants/sort";

/** Sort-field options, in dropdown order. */
export const SORT_FIELDS: WeatherSortField[] = Object.values(WEATHER_SORT_FIELD);
