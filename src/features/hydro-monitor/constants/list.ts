/** Fixed row height the virtualizer relies on — must match the row's `h-14`.
 * See docs/decisions/0004-list-rendering-performance.md. */
export const ROW_HEIGHT = 56;

export const LIST_HEIGHT = 560;

/** How long the search box waits after the last keystroke before querying. */
export const SEARCH_DEBOUNCE_MS = 300;

/** Rows rendered beyond the visible window, so fast scrolling doesn't flash blanks. */
export const VIRTUAL_OVERSCAN = 8;
