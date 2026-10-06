import {
  RoadAccidentsDashboard,
  roadAccidentsQueries,
  MAX_YEAR,
} from "@/features/road-accidents";
import type { Metric } from "@/features/road-accidents";

export const metadata = {
  title: "Wypadki drogowe w Polsce | Dashboardy",
  description:
    "Dashboard statystyk wypadków drogowych w Polsce na podstawie danych GUS BDL.",
};

const METRICS: Metric[] = ["accidents", "fatalities", "injured"];

export default async function RoadAccidentsPage() {
  const [initialTrend, initialBreakdown, latestValues] = await Promise.all([
    roadAccidentsQueries.getNationalTrend("accidents"),
    roadAccidentsQueries.getVoivodeshipBreakdown("accidents", MAX_YEAR),
    Promise.all(
      METRICS.map((metric) =>
        roadAccidentsQueries.getNationalTrend(metric, MAX_YEAR, MAX_YEAR),
      ),
    ),
  ]);

  const initialLatest = Object.fromEntries(
    METRICS.map((metric, i) => [metric, latestValues[i][0]?.value ?? null]),
  ) as Record<Metric, number | null>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <RoadAccidentsDashboard
        initialTrend={initialTrend}
        initialBreakdown={initialBreakdown}
        initialLatest={initialLatest}
      />
    </main>
  );
}
