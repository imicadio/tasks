export function errorId(id: string) {
  return `${id}-error`;
}

export function hintId(id: string) {
  return `${id}-hint`;
}

/** `aria-describedby` for a control with an optional hint and error. */
export function describedBy(id: string, hint: boolean, error: string | undefined) {
  return [hint && hintId(id), error && errorId(id)].filter(Boolean).join(" ") || undefined;
}
