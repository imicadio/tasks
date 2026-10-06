import { NextResponse } from "next/server";
import { weatherQueries, weatherQuerySchema } from "@/features/weather";
import { badRequest } from "@/shared/utils/http";
import { requestSearchParams } from "@/shared/utils/search-params";

export async function GET(request: Request) {
  const parsed = weatherQuerySchema.safeParse(requestSearchParams(request));
  if (!parsed.success) return badRequest(parsed.error);

  const stations = await weatherQueries.getWeatherStations();
  const data = weatherQueries.filterAndSortWeatherStations(stations, parsed.data);

  return NextResponse.json({ data, total: data.length });
}
