import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { FOCUS_ZOOM } from "../../constants";
import type { ParkingLot } from "../../types";

/** Pans and zooms the map to the selected lot. Renders nothing. */
export function FlyToLot({ target }: { target: ParkingLot | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lon], Math.max(map.getZoom(), FOCUS_ZOOM), {
      duration: 0.75,
    });
    // Only fly when the selected lot changes, not on every data refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.id]);
  return null;
}
