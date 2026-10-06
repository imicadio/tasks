import { NextResponse } from "next/server";
import { transitQueries, transitQuerySchema } from "@/features/transit";
import { badRequest } from "@/shared/utils/http";
import { requestSearchParams } from "@/shared/utils/search-params";

export async function GET(request: Request) {
  const parsed = transitQuerySchema.safeParse(requestSearchParams(request));
  if (!parsed.success) return badRequest(parsed.error);

  return NextResponse.json(
    await transitQueries.getVehiclesByRoute(parsed.data.route),
  );
}
