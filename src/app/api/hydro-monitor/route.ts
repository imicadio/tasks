import { NextResponse } from "next/server";
import { hydroMonitorQueries, hydroQuerySchema } from "@/features/hydro-monitor";

export async function GET(request: Request) {
  const searchParams = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );

  const parsed = hydroQuerySchema.safeParse(searchParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const stations = await hydroMonitorQueries.getHydroStations();
  const data = hydroMonitorQueries.filterAndSortStations(stations, parsed.data);

  return NextResponse.json({ data, total: data.length });
}
