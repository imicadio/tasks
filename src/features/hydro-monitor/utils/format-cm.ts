/** A water level in centimetres, or a dash when there's no reading. */
export function formatCm(value: number | null): string {
  return value === null ? "—" : `${value} cm`;
}
