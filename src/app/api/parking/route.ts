import { NextResponse } from "next/server";
import { parkingQueries } from "@/features/parking";

export async function GET() {
  return NextResponse.json(await parkingQueries.getParkingLots());
}
