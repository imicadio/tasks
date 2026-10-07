export const INCIDENT_CATEGORY = {
  Road: "road",
  Infrastructure: "infrastructure",
  Environment: "environment",
  Safety: "safety",
} as const;

export const INCIDENT_SEVERITY = {
  Low: "low",
  Medium: "medium",
  High: "high",
} as const;

/** `New` is reserved for reports submitted through the form in this
 * browser; the seeded incidents already went through triage. */
export const INCIDENT_STATUS = {
  New: "new",
  Verified: "verified",
  InProgress: "in-progress",
  Resolved: "resolved",
} as const;

/** State of the "fill the address from the map point" lookup. */
export const ADDRESS_LOOKUP = {
  Idle: "idle",
  Loading: "loading",
  Done: "done",
  NotFound: "not-found",
  Error: "error",
} as const;
