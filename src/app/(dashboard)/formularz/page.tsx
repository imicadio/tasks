import { IncidentReportDashboard } from "@/features/incident-report";

export const metadata = {
  title: "Gdańsk — zgłoś incydent | NASK Dashboardy",
  description:
    "Wieloetapowy formularz zgłoszenia incydentu w Gdańsku z mapą zgłoszeń.",
};

export default function FormularzPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <IncidentReportDashboard />
    </div>
  );
}
