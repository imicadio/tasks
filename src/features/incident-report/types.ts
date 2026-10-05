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

/** The form's in-progress values. Every field starts empty, so the types are
 * looser than `Incident` — the step schemas narrow them on submit. */
export type IncidentDraft = {
  category: IncidentCategory | "";
  severity: IncidentSeverity | "";
  title: string;
  description: string;
  district: string;
  lat: number | null;
  lon: number | null;
  address: string;
  /** `<input type="datetime-local">` value, e.g. "2026-10-05T08:30". */
  occurredAt: string;
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  consent: boolean;
};

export type FormStep = 0 | 1 | 2;

/** Field key → error message. Both `lat` and `lon` report under `location`. */
export type StepErrors = Partial<Record<keyof IncidentDraft | "location", string>>;

/** State of the "fill the address from the map point" lookup. */
export type AddressLookupStatus = "idle" | "loading" | "done" | "not-found" | "error";

/** `GET /api/incident-report/geocode` response. */
export type GeocodeResult = { address: string | null };
