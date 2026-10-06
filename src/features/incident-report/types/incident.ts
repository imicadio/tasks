export type IncidentCategory = "road" | "infrastructure" | "environment" | "safety";

export type IncidentSeverity = "low" | "medium" | "high";

/** `new` is reserved for reports submitted through the form in this browser;
 * the seeded incidents already went through triage. */
export type IncidentStatus = "new" | "verified" | "in-progress" | "resolved";

export type Incident = {
  id: string;
  /** Human-facing reference number shown after submitting (ZGL-…). */
  reference: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  lat: number;
  lon: number;
  address: string;
  /** ISO 8601. */
  occurredAt: string;
  /** ISO 8601. */
  reportedAt: string;
  /** Only on reports submitted from the form; never shown on the map. */
  reporter?: { name: string; email: string; phone: string };
};
