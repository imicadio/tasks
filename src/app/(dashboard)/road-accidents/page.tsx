import {
  RoadAccidentsDashboard,
  getRoadAccidentsPageData,
} from "@/features/road-accidents";

export const metadata = {
  title: "Wypadki drogowe w Polsce | Dashboardy",
  description:
    "Dashboard statystyk wypadków drogowych w Polsce na podstawie danych GUS BDL.",
};

const RoadAccidentsPage = async () => {
  const { trend, breakdown, latest } = await getRoadAccidentsPageData();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <RoadAccidentsDashboard
        initialTrend={trend}
        initialBreakdown={breakdown}
        initialLatest={latest}
      />
    </main>
  );
};

export default RoadAccidentsPage;
