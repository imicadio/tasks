import type { PageSearchParams } from "@/shared/types/search-params";

/** Flattens a page's `searchParams` to one value per key (the first one
 * when a key repeats), ready for a zod query schema. */
export function firstValues(
  searchParams: PageSearchParams,
): Record<string, string | undefined> {
  return Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );
}

/** A route handler's query string as a plain object, ready for a zod
 * query schema. */
export function requestSearchParams(request: Request): Record<string, string> {
  return Object.fromEntries(new URL(request.url).searchParams.entries());
}
