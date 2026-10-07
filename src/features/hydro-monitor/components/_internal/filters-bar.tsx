"use client";

import { Card } from "@/shared/ui/card";
import { FetchStatus } from "@/shared/ui/fetch-status";
import { Input } from "@/shared/ui/input";
import { OptionSelect } from "@/shared/ui/option-select";
import { Switch } from "@/shared/ui/switch";
import { labelOf } from "@/shared/utils/label-of";
import {
  ALL_FILTER,
  DIR_LABELS,
  SORT_DIRECTIONS,
  SORT_FIELDS,
  SORT_LABELS,
  STATUS_FILTER_LABELS,
  STATUS_FILTERS,
} from "../../constants";
import type { useHydroFilters } from "../../hooks/use-hydro-filters";
import { formatVoivodeshipOption } from "../../utils/format-voivodeship-option";

type Props = {
  filters: ReturnType<typeof useHydroFilters>;
  voivodeships: string[];
  onlyFavorites: boolean;
  onOnlyFavoritesChange: (value: boolean) => void;
  isFetching: boolean;
  isError: boolean;
};

/** Search, status/voivodeship filters, sort order and the favorites toggle. */
export const FiltersBar = ({
  filters,
  voivodeships,
  onlyFavorites,
  onOnlyFavoritesChange,
  isFetching,
  isError,
}: Props) => {
  const { params } = filters;

  return (
    <Card className="flex flex-wrap items-center gap-3">
      <Input
        value={filters.searchInput}
        onChange={filters.handleSearchChange}
        placeholder="Szukaj stacji lub rzeki…"
        aria-label="Szukaj stacji lub rzeki"
        className="max-w-xs"
      />
      <OptionSelect
        value={params.status}
        options={STATUS_FILTERS}
        getLabel={labelOf(STATUS_FILTER_LABELS)}
        onChange={filters.setStatus}
        ariaLabel="Filtruj według statusu"
        className="w-44"
      />
      <OptionSelect
        value={params.voivodeship}
        options={[ALL_FILTER, ...voivodeships]}
        getLabel={formatVoivodeshipOption}
        onChange={filters.setVoivodeship}
        ariaLabel="Filtruj według województwa"
        className="w-52"
      />
      <OptionSelect
        value={params.sort}
        options={SORT_FIELDS}
        getLabel={labelOf(SORT_LABELS)}
        onChange={filters.setSort}
        ariaLabel="Sortuj wyniki według"
        className="w-44"
      />
      <OptionSelect
        value={params.dir}
        options={SORT_DIRECTIONS}
        getLabel={labelOf(DIR_LABELS)}
        onChange={filters.setDir}
        ariaLabel="Kierunek sortowania"
        className="w-36"
      />
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <Switch checked={onlyFavorites} onCheckedChange={onOnlyFavoritesChange} />
        Tylko ulubione
      </label>
      <FetchStatus isFetching={isFetching} isError={isError} />
    </Card>
  );
};
