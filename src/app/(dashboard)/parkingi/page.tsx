import { ParkingDashboard, parkingQueries } from "@/features/parking";

export const metadata = {
  title: "Gdańsk — parkingi | Dashboardy",
  description:
    "Parkingi w Gdańsku z liczbą wolnych miejsc na żywo (ckan.multimediagdansk.pl).",
};

export default async function ParkingiPage() {
  const snapshot = await parkingQueries.getParkingLots();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <ParkingDashboard initialSnapshot={snapshot} />
    </div>
  );
}
