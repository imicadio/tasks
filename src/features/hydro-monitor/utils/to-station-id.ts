import type { StationId } from "../types";

export function toStationId(rawId: number | string): StationId {
  return String(rawId) as StationId;
}
