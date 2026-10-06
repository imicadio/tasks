"use client";

import { Card } from "@/shared/ui/card";
import { FetchStatus } from "@/shared/ui/fetch-status";
import { Input } from "@/shared/ui/input";
import { OptionSelect } from "@/shared/ui/option-select";
import { labelOf } from "@/shared/utils/label-of";
import {
  DIR_LABELS,
  SORT_DIRECTIONS,
  SORT_FIELDS,
  SORT_LABELS,
} from "../../constants";
import type { useWeatherFilters } from "../../hooks/use-weather-filters";

type Props = {
  filters: ReturnType<typeof useWeatherFilters>;
  isFetching: boolean;
  isError: boolean;
};

/** Station search and sort order. */
export const FiltersBar = ({ filters, isFetching, isError }: Props) => {
  return (
    <Card className="flex flex-wrap items-center gap-3">
      <Input
        value={filters.searchInput}
        onChange={filters.handleSearchChange}
        placeholder="Szukaj stacji…"
        aria-label="Szukaj stacji pogodowej"
        className="max-w-xs"
      />
      <OptionSelect
        value={filters.params.sort}
        options={SORT_FIELDS}
        getLabel={labelOf(SORT_LABELS)}
        onChange={filters.setSort}
        ariaLabel="Sortuj wyniki według"
        className="w-48"
      />
      <OptionSelect
        value={filters.params.dir}
        options={SORT_DIRECTIONS}
        getLabel={labelOf(DIR_LABELS)}
        onChange={filters.setDir}
        ariaLabel="Kierunek sortowania"
        className="w-36"
      />
      <FetchStatus isFetching={isFetching} isError={isError} />
    </Card>
  );
};
