import type { ValueOf } from "@/shared/types/value-of";
import type {
  INCIDENT_CATEGORY,
  INCIDENT_SEVERITY,
  INCIDENT_STATUS,
} from "../constants";

export type IncidentCategory = ValueOf<typeof INCIDENT_CATEGORY>;

export type IncidentSeverity = ValueOf<typeof INCIDENT_SEVERITY>;

export type IncidentStatus = ValueOf<typeof INCIDENT_STATUS>;

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
