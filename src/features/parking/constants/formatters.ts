// Fixed time zone so server- and client-rendered output match regardless
// of where either runs (avoids a hydration mismatch).
export const DATE_TIME_FORMAT = new Intl.DateTimeFormat("pl-PL", {
  timeZone: "Europe/Warsaw",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export const TIME_FORMAT = new Intl.DateTimeFormat("pl-PL", {
  timeZone: "Europe/Warsaw",
  hour: "2-digit",
  minute: "2-digit",
});

/** Shown in place of a value the feed didn't report. */
export const MISSING_VALUE = "—";
