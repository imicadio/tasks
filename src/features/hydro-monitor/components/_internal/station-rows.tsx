import type { PerfMode, StationRowsProps } from "../../types";
import { NaiveStationRows } from "./naive-station-rows";
import { VirtualStationRows } from "./virtual-station-rows";

type Props = StationRowsProps & { perfMode: PerfMode };

/** Picks the row renderer for the perf-demo mode. */
export const StationRows = ({
  perfMode,
  ...props
}: Props) => {
  if (perfMode === "naive") return <NaiveStationRows {...props} />;
  return <VirtualStationRows {...props} />;
};
