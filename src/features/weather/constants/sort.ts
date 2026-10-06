import type { SortDirection, WeatherSortField } from "../types";

export const SORT_LABELS: Record<WeatherSortField, string> = {
  temperatureC: "Sortuj: temperatura",
  windSpeedMs: "Sortuj: wiatr",
  name: "Sortuj: nazwa",
};

export const DIR_LABELS: Record<SortDirection, string> = {
  desc: "Malejąco",
  asc: "Rosnąco",
};
