import { DashboardSkeleton } from "@/shared/ui/dashboard-skeleton";

const Loading = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <DashboardSkeleton kpis={0} filters={false} content="two-columns" />
    </div>
  );
};

export default Loading;
