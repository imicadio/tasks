import type { HydroStationsResponse } from "./query";
import type { StatusCounts } from "./station";

/** Everything the dashboard page needs for its first, server-side render. */
export type HydroPageData = {
  initialData: HydroStationsResponse;
  voivodeships: string[];
  statusCounts: StatusCounts;
};
