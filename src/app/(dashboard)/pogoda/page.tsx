import { WeatherDashboard, weatherQueries, weatherQuerySchema } from "@/features/weather";

export const metadata = {
  title: "Pogoda | Dashboardy",
  description:
    "Bieżące warunki pogodowe na stacjach synoptycznych IMGW-PIB w Polsce.",
};

export default async function PogodaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const parsed = weatherQuerySchema.parse(
    Object.fromEntries(
      Object.entries(rawParams).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value,
      ]),
    ),
  );

  const allStations = await weatherQueries.getWeatherStations();
  const initialData = {
    data: weatherQueries.filterAndSortWeatherStations(allStations, parsed),
    total: allStations.length,
  };
  const summary = weatherQueries.summarizeWeather(allStations);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <WeatherDashboard
        initialParams={parsed}
        initialData={initialData}
        summary={summary}
      />
    </main>
  );
}
