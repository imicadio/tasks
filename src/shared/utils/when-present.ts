/** Wraps a setter so `null` is ignored — for controls like a Select whose
 * change callback can report "no value", where we want to keep the last one. */
export function whenPresent<T>(setter: (value: T) => void) {
  return (value: T | null) => {
    if (value !== null) setter(value);
  };
}
