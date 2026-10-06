import { NextResponse } from "next/server";
import { hydroMonitorQueries, hydroQuerySchema } from "@/features/hydro-monitor";
import { badRequest } from "@/shared/utils/http";
import { requestSearchParams } from "@/shared/utils/search-params";

export async function GET(request: Request) {
  const parsed = hydroQuerySchema.safeParse(requestSearchParams(request));
  if (!parsed.success) return badRequest(parsed.error);

  const stations = await hydroMonitorQueries.getHydroStations();
  const data = hydroMonitorQueries.filterAndSortStations(stations, parsed.data);

  return NextResponse.json({ data, total: data.length });
}
