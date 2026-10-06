/** Label of a voivodeship filter option; "all" reads as every voivodeship. */
export function formatVoivodeshipOption(value: string): string {
  return value === "all" ? "Wszystkie województwa" : value;
}
