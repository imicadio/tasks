import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { FOCUS_ZOOM } from "../../constants";
import type { LatLng } from "../../types";

/** Pans and zooms the map to the selected vehicle. Renders nothing. */
export const FlyToVehicle = ({ target }: { target: LatLng | null }) => {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lon], Math.max(map.getZoom(), FOCUS_ZOOM), {
      duration: 0.75,
    });
    // Only fly when the target identity changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.lat, target?.lon]);
  return null;
};
