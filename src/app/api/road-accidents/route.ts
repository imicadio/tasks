import { NextResponse } from "next/server";
import {
  breakdownQuerySchema,
  trendQuerySchema,
  roadAccidentsQueries,
} from "@/features/road-accidents";
import type { YearDatum } from "@/features/road-accidents";
import type { Paginated } from "@/shared/types/pagination";

export async function GET(request: Request) {
  const searchParams = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );

  if (searchParams.kind === "breakdown") {
    const parsed = breakdownQuerySchema.safeParse(searchParams);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { metric, year } = parsed.data;
    const data = await roadAccidentsQueries.getVoivodeshipBreakdown(
      metric,
      year,
    );
    return NextResponse.json({ data, year });
  }

  const parsed = trendQuerySchema.safeParse(searchParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { metric, page, pageSize } = parsed.data;
  const allYears = await roadAccidentsQueries.getNationalTrend(metric);
  const start = (page - 1) * pageSize;
  const response: Paginated<YearDatum> = {
    data: allYears.slice(start, start + pageSize),
    page,
    pageSize,
    total: allYears.length,
  };
  return NextResponse.json(response);
}
