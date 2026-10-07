"use client";

import { useUrlState } from "@/shared/hooks/use-url-state";
import { useDebouncedUrlParam } from "@/shared/hooks/use-debounced-url-param";
import { SEARCH_DEBOUNCE_MS, STATUS_FILTER } from "../constants";
import type {
  HydroStationsParams,
  SortDirection,
  SortField,
  StationStatus,
  StatusFilter,
} from "../types";

/**
 * The station list's filters, kept in the URL so a filtered view is
 * shareable. URL keys must match `hydroQuerySchema`'s fields — the page
 * parses raw searchParams through that schema for SSR, so a mismatched key
 * silently drops the filter on first load.
 */
export function useHydroFilters(initial: HydroStationsParams) {
  const search = useDebouncedUrlParam("q", initial.q, SEARCH_DEBOUNCE_MS);
  const [status, setStatus] = useUrlState<StatusFilter>("status", initial.status);
  const [voivodeship, setVoivodeship] = useUrlState("voivodeship", initial.voivodeship);
  const [sort, setSort] = useUrlState<SortField>("sort", initial.sort);
  const [dir, setDir] = useUrlState<SortDirection>("dir", initial.dir);

  /** KPI tile click: filter to that status, or clear it if already active. */
  const toggleStatus = (selected: StationStatus) =>
    setStatus(status === selected ? STATUS_FILTER.All : selected);

  const params: HydroStationsParams = {
    q: search.value,
    status,
    voivodeship,
    sort,
    dir,
  };

  return {
    params,
    searchInput: search.input,
    handleSearchChange: search.handleInputChange,
    setStatus,
    toggleStatus,
    setVoivodeship,
    setSort,
    setDir,
  };
}
