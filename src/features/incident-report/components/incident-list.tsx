import type { Incident } from "../types";
import { IncidentListItem } from "./_internal/incident-list-item";

type Props = {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

/** The map's text equivalent: every incident as a list item; activating one
 * flies the map to it. */
export const IncidentList = ({ incidents, selectedId, onSelect }: Props) => {
  const handleSelect = (id: string) => () => onSelect(id);

  return (
    <ul aria-label="Lista incydentów" className="flex flex-col gap-2">
      {incidents.map((incident) => (
        <li key={incident.id}>
          <IncidentListItem
            incident={incident}
            selected={incident.id === selectedId}
            onSelect={handleSelect(incident.id)}
          />
        </li>
      ))}
    </ul>
  );
};
