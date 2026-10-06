/** A lookup function over a label map — for render props that receive a
 * key and must return its label, e.g. `<SelectValue>{labelOf(SORT_LABELS)}`. */
export function labelOf<K extends string>(labels: Record<K, string>) {
  return (key: K): string => labels[key];
}
