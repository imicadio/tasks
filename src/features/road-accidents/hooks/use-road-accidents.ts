"use client";

import { useEffect, useRef, useState } from "react";
import { YEARS_DESC } from "../constants";
import type {
  Metric,
  RoadAccidentsInitialState,
  VoivodeshipDatum,
  YearDatum,
} from "../types";
import type { Paginated } from "@/shared/types/pagination";

export function useRoadAccidents(initial: RoadAccidentsInitialState) {
  const [metric, setMetric] = useState<Metric>(initial.metric);
  const [year, setYear] = useState<number>(initial.year);
  const [trend, setTrend] = useState<YearDatum[]>(initial.trend);
  const [breakdown, setBreakdown] = useState<VoivodeshipDatum[]>(
    initial.breakdown,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      fetch(
        `/api/road-accidents?kind=trend&metric=${metric}&page=1&pageSize=${YEARS_DESC.length}`,
      ).then((res) => res.json() as Promise<Paginated<YearDatum>>),
      fetch(
        `/api/road-accidents?kind=breakdown&metric=${metric}&year=${year}`,
      ).then((res) => res.json() as Promise<{ data: VoivodeshipDatum[] }>),
    ])
      .then(([trendRes, breakdownRes]) => {
        if (cancelled) return;
        setTrend(trendRes.data);
        setBreakdown(breakdownRes.data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Nie udało się pobrać danych.",
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [metric, year]);

  return {
    metric,
    setMetric,
    year,
    setYear,
    trend,
    breakdown,
    isLoading,
    error,
  };
}
