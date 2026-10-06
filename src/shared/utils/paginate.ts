import type { Paginated } from "@/shared/types/pagination";

/** Slices one 1-based page out of an in-memory list. */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): Paginated<T> {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
  };
}
