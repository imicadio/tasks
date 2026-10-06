export function errorId(id: string) {
  return `${id}-error`;
}

export function hintId(id: string) {
  return `${id}-hint`;
}

/** Space-separated id list for `aria-describedby`, skipping empty entries;
 * `undefined` when nothing is left. */
export function joinIds(...ids: (string | false | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined;
}

/** `aria-describedby` for a control with an optional hint and error. */
export function describedBy(id: string, hint: boolean, error: string | undefined) {
  return joinIds(hint && hintId(id), error && errorId(id));
}
