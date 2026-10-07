import type { SortDirection } from "@/shared/types/sort";

export const SORT_DIRECTION = {
  Asc: "asc",
  Desc: "desc",
} as const;

/** Sort-direction options, in dropdown order. */
export const SORT_DIRECTIONS: SortDirection[] = [SORT_DIRECTION.Desc, SORT_DIRECTION.Asc];

export const DIR_LABELS: Record<SortDirection, string> = {
  [SORT_DIRECTION.Desc]: "Malejąco",
  [SORT_DIRECTION.Asc]: "Rosnąco",
};
