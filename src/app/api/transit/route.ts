import { NextResponse } from "next/server";
import { transitQueries, transitQuerySchema } from "@/features/transit";

export async function GET(request: Request) {
  const searchParams = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );

  const parsed = transitQuerySchema.safeParse(searchParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const snapshot = await transitQueries.getVehiclePositions();
  const vehicles = transitQueries.filterByRoute(
    snapshot.vehicles,
    parsed.data.route,
  );

  return NextResponse.json({ lastUpdate: snapshot.lastUpdate, vehicles });
}
