import type { SortDirection, SortField } from "../types";

export const SORT_LABELS: Record<SortField, string> = {
  status: "Sortuj: status",
  waterLevelCm: "Sortuj: stan wody",
  name: "Sortuj: nazwa",
};

export const DIR_LABELS: Record<SortDirection, string> = {
  desc: "Malejąco",
  asc: "Rosnąco",
};
