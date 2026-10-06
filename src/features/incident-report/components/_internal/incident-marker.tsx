import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { CATEGORY_LABELS, SEVERITY_LABELS, STATUS_LABELS } from "../../constants";
import type { Incident } from "../../types";
import { formatDateTime } from "../../utils/format";
import { createIncidentIcon } from "../../utils/marker-icon";

/** One incident's map marker with a details popup. */
export function IncidentMarker({
  incident,
  selected,
  onSelect,
}: {
  incident: Incident;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const icon = useMemo(() => createIncidentIcon(incident, selected), [incident, selected]);
  return (
    <Marker
      position={[incident.lat, incident.lon]}
      icon={icon}
      eventHandlers={{ click: () => onSelect(incident.id) }}
      zIndexOffset={incident.status === "new" ? 1000 : selected ? 500 : 0}
    >
      <Popup>
        <div className="flex flex-col gap-1 text-sm">
          <strong>{incident.title}</strong>
          <span>{incident.address}</span>
          <span>
            {CATEGORY_LABELS[incident.category]} · zagrożenie{" "}
            {SEVERITY_LABELS[incident.severity].toLowerCase()}
          </span>
          <span>Status: {STATUS_LABELS[incident.status]}</span>
          <span>{formatDateTime(incident.occurredAt)}</span>
        </div>
      </Popup>
    </Marker>
  );
}
