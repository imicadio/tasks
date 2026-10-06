import {
  WeatherDashboard,
  getWeatherPageData,
  weatherQuerySchema,
} from "@/features/weather";
import { firstValues } from "@/shared/utils/search-params";

export const metadata = {
  title: "Pogoda | Dashboardy",
  description:
    "Bieżące warunki pogodowe na stacjach synoptycznych IMGW-PIB w Polsce.",
};

const PogodaPage = async ({ searchParams }: PageProps<"/pogoda">) => {
  const params = weatherQuerySchema.parse(firstValues(await searchParams));
  const pageData = await getWeatherPageData(params);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <WeatherDashboard initialParams={params} {...pageData} />
    </main>
  );
};

export default PogodaPage;
