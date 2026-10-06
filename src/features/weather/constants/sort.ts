import type { WeatherSortField } from "../types";

export const SORT_LABELS: Record<WeatherSortField, string> = {
  temperatureC: "Sortuj: temperatura",
  windSpeedMs: "Sortuj: wiatr",
  name: "Sortuj: nazwa",
};

export { DIR_LABELS, SORT_DIRECTIONS } from "@/shared/constants/sort";

/** Sort-field options, in dropdown order. */
export const SORT_FIELDS: WeatherSortField[] = ["temperatureC", "windSpeedMs", "name"];
