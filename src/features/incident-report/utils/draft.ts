import { INCIDENT_STATUS } from "../constants";
import type { Incident, IncidentDraft, LatLngTuple } from "../types";
import type { IncidentReportInput } from "../schemas";
import { createReference } from "./format";

/** The draft's map point, or null until both coordinates are set. */
export function draftPoint(draft: IncidentDraft): LatLngTuple | null {
  return draft.lat !== null && draft.lon !== null ? [draft.lat, draft.lon] : null;
}

/** A validated report as a `new` incident, reported at `now`. */
export function toIncident(
  input: IncidentReportInput,
  now: Date,
  id: string = crypto.randomUUID(),
): Incident {
  return {
    id,
    reference: createReference(now),
    title: input.title,
    description: input.description,
    category: input.category,
    severity: input.severity,
    status: INCIDENT_STATUS.New,
    lat: input.lat,
    lon: input.lon,
    address: input.address,
    occurredAt: new Date(input.occurredAt).toISOString(),
    reportedAt: now.toISOString(),
    reporter: {
      name: input.reporterName,
      email: input.reporterEmail,
      phone: input.reporterPhone,
    },
  };
}
