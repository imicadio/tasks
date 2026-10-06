"use client";

import { useDebouncedUrlParam } from "@/shared/hooks/use-debounced-url-param";
import { useUrlState } from "@/shared/hooks/use-url-state";
import { SEARCH_DEBOUNCE_MS } from "../constants";
import type {
  SortDirection,
  WeatherSortField,
  WeatherStationsParams,
} from "../types";

/** Search and sort order of the station list, kept in the URL. Keys must
 * match `weatherQuerySchema`, which the page uses to parse them for SSR. */
export function useWeatherFilters(initial: WeatherStationsParams) {
  const search = useDebouncedUrlParam("q", initial.q, SEARCH_DEBOUNCE_MS);
  const [sort, setSort] = useUrlState<WeatherSortField>("sort", initial.sort);
  const [dir, setDir] = useUrlState<SortDirection>("dir", initial.dir);

  const params: WeatherStationsParams = { q: search.value, sort, dir };

  return {
    params,
    searchInput: search.input,
    handleSearchChange: search.handleInputChange,
    setSort,
    setDir,
  };
}
