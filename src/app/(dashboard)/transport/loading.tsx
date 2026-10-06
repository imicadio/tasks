import { DashboardSkeleton } from "@/shared/ui/dashboard-skeleton";

const Loading = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <DashboardSkeleton kpis={3} content="map-with-list" />
    </div>
  );
};

export default Loading;
