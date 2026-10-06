import type { SortDirection } from "@/shared/types/sort";

/** Sort-direction options, in dropdown order. */
export const SORT_DIRECTIONS: SortDirection[] = ["desc", "asc"];

export const DIR_LABELS: Record<SortDirection, string> = {
  desc: "Malejąco",
  asc: "Rosnąco",
};
