import {
  TransitDashboard,
  transitQueries,
  transitQuerySchema,
} from "@/features/transit";

export const metadata = {
  title: "Gdańsk — transport publiczny | NASK Dashboardy",
  description:
    "Mapa pozycji GPS pojazdów komunikacji publicznej w Gdańsku na żywo (Tristar / ZTM Gdańsk).",
};

export default async function TransportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const parsed = transitQuerySchema.parse(
    Object.fromEntries(
      Object.entries(rawParams).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value,
      ]),
    ),
  );

  const snapshot = await transitQueries.getVehiclePositions();
  const vehicles = transitQueries.filterByRoute(
    snapshot.vehicles,
    parsed.route,
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <TransitDashboard
        initialRoute={parsed.route}
        initialSnapshot={{ lastUpdate: snapshot.lastUpdate, vehicles }}
      />
    </main>
  );
}
