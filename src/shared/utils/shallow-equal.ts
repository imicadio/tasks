/** True when both objects have the same keys with `===` values. */
export function shallowEqual<T extends object>(a: T, b: T): boolean {
  const keys = Object.keys(a) as (keyof T)[];
  return (
    keys.length === Object.keys(b).length && keys.every((key) => a[key] === b[key])
  );
}
