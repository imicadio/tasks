import {
  HydroMonitorDashboard,
  getHydroPageData,
  hydroQuerySchema,
} from "@/features/hydro-monitor";
import { firstValues } from "@/shared/utils/search-params";

export const metadata = {
  title: "Monitoring hydrologiczny | Dashboardy",
  description:
    "Poziomy wody i statusy alarmowe stacji wodowskazowych w Polsce na podstawie danych IMGW-PIB.",
};

export default async function HydrologiaPage({ searchParams }: PageProps<"/hydrologia">) {
  const params = hydroQuerySchema.parse(firstValues(await searchParams));
  const pageData = await getHydroPageData(params);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <HydroMonitorDashboard initialParams={params} {...pageData} />
    </main>
  );
}
