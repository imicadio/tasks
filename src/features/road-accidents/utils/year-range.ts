/** Every year from `from` to `to`, inclusive, oldest first. */
export function yearRange(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}
