import {
  HydroMonitorDashboard,
  hydroMonitorQueries,
  hydroQuerySchema,
} from "@/features/hydro-monitor";
import type { StationStatus } from "@/features/hydro-monitor";

export const metadata = {
  title: "Monitoring hydrologiczny | Dashboardy",
  description:
    "Poziomy wody i statusy alarmowe stacji wodowskazowych w Polsce na podstawie danych IMGW-PIB.",
};

export default async function HydrologiaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const parsed = hydroQuerySchema.parse(
    Object.fromEntries(
      Object.entries(rawParams).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value,
      ]),
    ),
  );

  const allStations = await hydroMonitorQueries.getHydroStations();
  const initialData = {
    data: hydroMonitorQueries.filterAndSortStations(allStations, parsed),
    total: allStations.length,
  };

  const voivodeships = Array.from(
    new Set(allStations.map((s) => s.voivodeship)),
  ).sort((a, b) => a.localeCompare(b, "pl"));

  const statusCounts = allStations.reduce(
    (acc, s) => {
      acc[s.status] += 1;
      return acc;
    },
    { alarm: 0, warning: 0, normal: 0, unknown: 0 } as Record<
      StationStatus,
      number
    >,
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <HydroMonitorDashboard
        initialParams={parsed}
        initialData={initialData}
        voivodeships={voivodeships}
        statusCounts={statusCounts}
      />
    </main>
  );
}
