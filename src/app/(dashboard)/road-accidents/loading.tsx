import { DashboardSkeleton } from "@/shared/ui/dashboard-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <DashboardSkeleton kpis={3} />
    </div>
  );
}
