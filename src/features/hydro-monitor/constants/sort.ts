import type { SortField } from "../types";

export const SORT_FIELD = {
  Status: "status",
  WaterLevel: "waterLevelCm",
  Name: "name",
} as const;

export const SORT_LABELS: Record<SortField, string> = {
  [SORT_FIELD.Status]: "Sortuj: status",
  [SORT_FIELD.WaterLevel]: "Sortuj: stan wody",
  [SORT_FIELD.Name]: "Sortuj: nazwa",
};

export { DIR_LABELS, SORT_DIRECTION, SORT_DIRECTIONS } from "@/shared/constants/sort";

/** Sort-field options, in dropdown order. */
export const SORT_FIELDS: SortField[] = Object.values(SORT_FIELD);
