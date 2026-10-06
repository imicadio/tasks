import {
  TransitDashboard,
  transitQueries,
  transitQuerySchema,
} from "@/features/transit";
import { firstValues } from "@/shared/utils/search-params";

export const metadata = {
  title: "Gdańsk — transport publiczny | Dashboardy",
  description:
    "Mapa pozycji GPS pojazdów komunikacji publicznej w Gdańsku na żywo (Tristar / ZTM Gdańsk).",
};

export default async function TransportPage({
  searchParams,
}: PageProps<"/transport">) {
  const { route } = transitQuerySchema.parse(firstValues(await searchParams));
  const snapshot = await transitQueries.getVehiclesByRoute(route);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <TransitDashboard initialRoute={route} initialSnapshot={snapshot} />
    </main>
  );
}
