import { notFound } from "next/navigation";
import { WeatherStationDetail, weatherQueries } from "@/features/weather";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const station = await weatherQueries.getWeatherStationById(id);
  return {
    title: station
      ? `${station.name} — Pogoda | NASK Dashboardy`
      : "Nie znaleziono stacji | NASK Dashboardy",
  };
}

export default async function WeatherStationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const station = await weatherQueries.getWeatherStationById(id);

  if (!station) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <WeatherStationDetail station={station} />
    </main>
  );
}
