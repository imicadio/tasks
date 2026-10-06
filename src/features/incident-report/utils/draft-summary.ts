import { CATEGORY_LABELS, DISTRICTS, MISSING_VALUE, SEVERITY_LABELS } from "../constants";
import type { IncidentDraft } from "../types";
import { formatDateTime } from "./format";

/** The draft as display strings for the pre-submit summary, with a dash
 * for anything not filled in yet. */
export function draftSummary(draft: IncidentDraft) {
  const district = DISTRICTS.find((d) => d.id === draft.district);
  const address = draft.address || MISSING_VALUE;

  return {
    category: draft.category ? CATEGORY_LABELS[draft.category] : MISSING_VALUE,
    severity: draft.severity ? SEVERITY_LABELS[draft.severity] : MISSING_VALUE,
    title: draft.title || MISSING_VALUE,
    place: district ? `${address}, ${district.name}` : address,
    when: draft.occurredAt ? formatDateTime(draft.occurredAt) : MISSING_VALUE,
  };
}
