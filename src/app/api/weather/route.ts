import { NextResponse } from "next/server";
import { weatherQueries, weatherQuerySchema } from "@/features/weather";

export async function GET(request: Request) {
  const searchParams = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );

  const parsed = weatherQuerySchema.safeParse(searchParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const stations = await weatherQueries.getWeatherStations();
  const data = weatherQueries.filterAndSortWeatherStations(
    stations,
    parsed.data,
  );

  return NextResponse.json({ data, total: data.length });
}
