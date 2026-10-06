import type { SortField } from "../types";

export const SORT_LABELS: Record<SortField, string> = {
  status: "Sortuj: status",
  waterLevelCm: "Sortuj: stan wody",
  name: "Sortuj: nazwa",
};

export { DIR_LABELS, SORT_DIRECTIONS } from "@/shared/constants/sort";

/** Sort-field options, in dropdown order. */
export const SORT_FIELDS: SortField[] = ["status", "waterLevelCm", "name"];
