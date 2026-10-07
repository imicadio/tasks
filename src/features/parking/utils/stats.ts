import { AVAILABILITY_STATUS } from "../constants";
import type { ParkingLot } from "../types";

/** Lots reporting zero free spots. */
export function countFullLots(lots: ParkingLot[]): number {
  return lots.filter((lot) => lot.status === AVAILABILITY_STATUS.Full).length;
}

/** Free spots summed over every lot that reports a count. */
export function totalFreeSpots(lots: ParkingLot[]): number {
  return lots.reduce((sum, lot) => sum + (lot.availableSpots ?? 0), 0);
}
