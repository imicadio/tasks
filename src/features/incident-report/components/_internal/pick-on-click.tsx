import { useMapEvents } from "react-leaflet";

type Props = { onPick: (lat: number, lon: number) => void };

/** Reports map clicks as coordinates. Renders nothing. */
export const PickOnClick = ({ onPick }: Props) => {
  useMapEvents({
    click: (event) => onPick(event.latlng.lat, event.latlng.lng),
  });
  return null;
};
