import { NextResponse } from "next/server";
import { weatherQueries } from "@/features/weather";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const station = await weatherQueries.getWeatherStationById(id);

  if (!station) {
    return NextResponse.json({ error: "Nie znaleziono stacji." }, { status: 404 });
  }

  return NextResponse.json({ data: station });
}
