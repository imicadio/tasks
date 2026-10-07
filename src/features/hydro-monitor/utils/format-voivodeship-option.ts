import { ALL_FILTER } from "../constants";

/** Label of a voivodeship filter option; ALL_FILTER reads as every voivodeship. */
export function formatVoivodeshipOption(value: string): string {
  return value === ALL_FILTER ? "Wszystkie województwa" : value;
}
