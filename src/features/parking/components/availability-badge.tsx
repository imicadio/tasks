import { AVAILABILITY_COLOR_VAR, AVAILABILITY_LABELS } from "../constants";
import type { AvailabilityStatus } from "../types";

/** Status as text, with color only as a reinforcing dot (WCAG 1.4.1). */
export const AvailabilityBadge = ({ status }: { status: AvailabilityStatus }) => {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span
        aria-hidden="true"
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: AVAILABILITY_COLOR_VAR[status] }}
      />
      {AVAILABILITY_LABELS[status]}
    </span>
  );
};
