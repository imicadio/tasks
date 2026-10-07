import { INCIDENT_STATUS, SEVERITY_COLOR_VAR } from "../../constants";
import type { Incident } from "../../types";

type Props = { incident: Incident };

/** Severity-colored dot; a pulsing live dot for new reports. Decorative. */
export const IncidentDot = ({ incident }: Props) => {
  if (incident.status === INCIDENT_STATUS.New) {
    return <span aria-hidden="true" className="incident-live-dot mt-1.5 shrink-0" />;
  }
  return (
    <span
      aria-hidden="true"
      className="mt-1.5 size-2.5 shrink-0 rounded-full"
      style={{ backgroundColor: SEVERITY_COLOR_VAR[incident.severity] }}
    />
  );
};
