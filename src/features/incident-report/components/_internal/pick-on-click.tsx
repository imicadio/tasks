import { useMapEvents } from "react-leaflet";

/** Reports map clicks as coordinates. Renders nothing. */
export const PickOnClick = ({ onPick }: { onPick: (lat: number, lon: number) => void }) => {
  useMapEvents({
    click: (event) => onPick(event.latlng.lat, event.latlng.lng),
  });
  return null;
};
