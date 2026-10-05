import { NextResponse, type NextRequest } from "next/server";
import { geocodeQuerySchema, incidentReportQueries } from "@/features/incident-report";

export async function GET(request: NextRequest) {
  const query = geocodeQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!query.success) {
    return NextResponse.json({ error: "Punkt musi leżeć w Gdańsku." }, { status: 400 });
  }
  try {
    return NextResponse.json(
      await incidentReportQueries.reverseGeocode(query.data.lat, query.data.lon),
    );
  } catch {
    return NextResponse.json({ error: "Nie udało się ustalić adresu." }, { status: 502 });
  }
}
