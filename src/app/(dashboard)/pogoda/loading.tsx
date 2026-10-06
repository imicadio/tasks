import { DashboardSkeleton } from "@/shared/ui/dashboard-skeleton";

const Loading = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <DashboardSkeleton kpis={3} />
    </div>
  );
};

export default Loading;
