import { IncidentReportDashboard } from "@/features/incident-report";

export const metadata = {
  title: "Gdańsk — zgłoś incydent | Dashboardy",
  description:
    "Wieloetapowy formularz zgłoszenia incydentu w Gdańsku z mapą zgłoszeń.",
};

const FormularzPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <IncidentReportDashboard />
    </div>
  );
};

export default FormularzPage;
