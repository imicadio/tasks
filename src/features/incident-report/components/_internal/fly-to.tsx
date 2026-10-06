import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { FOCUS_ZOOM } from "../../constants";
import type { LatLngTuple } from "../../types";

/** Flies to a selected incident. For the picked location only pans when
 * the point is off-screen (e.g. a district chosen from the list) — a map
 * click shouldn't move the map out from under the cursor. */
export function FlyTo({
  target,
  onlyIfHidden,
}: {
  target: LatLngTuple | null;
  onlyIfHidden: boolean;
}) {
  const map = useMap();
  const lat = target?.[0];
  const lon = target?.[1];
  useEffect(() => {
    if (lat === undefined || lon === undefined) return;
    if (onlyIfHidden && map.getBounds().contains([lat, lon])) return;
    map.flyTo([lat, lon], Math.max(map.getZoom(), FOCUS_ZOOM), { duration: 0.75 });
  }, [map, lat, lon, onlyIfHidden]);
  return null;
}
