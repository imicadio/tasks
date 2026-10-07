import { SKELETON_CONTENT } from "@/shared/constants/ui";
import { DashboardSkeleton } from "@/shared/ui/dashboard-skeleton";

const Loading = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <DashboardSkeleton kpis={9} filters={false} content={SKELETON_CONTENT.None} />
    </div>
  );
};

export default Loading;
