import { NextResponse } from "next/server";
import {
  breakdownQuerySchema,
  trendQuerySchema,
  roadAccidentsQueries,
} from "@/features/road-accidents";
import { badRequest } from "@/shared/utils/http";
import { paginate } from "@/shared/utils/paginate";
import { requestSearchParams } from "@/shared/utils/search-params";

export async function GET(request: Request) {
  const searchParams = requestSearchParams(request);

  if (searchParams.kind === "breakdown") {
    const parsed = breakdownQuerySchema.safeParse(searchParams);
    if (!parsed.success) return badRequest(parsed.error);

    const { metric, year } = parsed.data;
    const data = await roadAccidentsQueries.getVoivodeshipBreakdown(metric, year);
    return NextResponse.json({ data, year });
  }

  const parsed = trendQuerySchema.safeParse(searchParams);
  if (!parsed.success) return badRequest(parsed.error);

  const { metric, page, pageSize } = parsed.data;
  const allYears = await roadAccidentsQueries.getNationalTrend(metric);
  return NextResponse.json(paginate(allYears, page, pageSize));
}
