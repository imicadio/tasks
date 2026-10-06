import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { STATUS_LABELS } from "../../constants";
import type { Incident } from "../../types";
import { formatDateTime, formatIncidentMeta } from "../../utils/format";
import { markerZIndex } from "../../utils/marker-z-index";
import { createIncidentIcon } from "../../utils/marker-icon";

/** One incident's map marker with a details popup. */
export const IncidentMarker = ({
  incident,
  selected,
  onSelect,
}: {
  incident: Incident;
  selected: boolean;
  onSelect: (id: string) => void;
}) => {
  const icon = useMemo(() => createIncidentIcon(incident, selected), [incident, selected]);
  return (
    <Marker
      position={[incident.lat, incident.lon]}
      icon={icon}
      eventHandlers={{ click: () => onSelect(incident.id) }}
      zIndexOffset={markerZIndex(incident, selected)}
    >
      <Popup>
        <div className="flex flex-col gap-1 text-sm">
          <strong>{incident.title}</strong>
          <span>{incident.address}</span>
          <span>{formatIncidentMeta(incident)}</span>
          <span>Status: {STATUS_LABELS[incident.status]}</span>
          <span>{formatDateTime(incident.occurredAt)}</span>
        </div>
      </Popup>
    </Marker>
  );
};
