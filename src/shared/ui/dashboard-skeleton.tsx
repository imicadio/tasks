import { SKELETON_CONTENT } from "@/shared/constants/ui";
import { cn } from "@/shared/utils/cn";
import type { SkeletonContent } from "@/shared/types/skeleton";
import { Skeleton } from "./skeleton";

type Props = {
  /** Number of KPI tiles; 0 for none. */
  kpis: number;
  /** Whether to show a filter bar between the tiles and the content. */
  filters?: boolean;
  content?: SkeletonContent;
};

/**
 * Placeholder for a dashboard page while its server data loads — used by
 * the routes' `loading.tsx`. Mirrors the shared page shape (heading, KPI
 * tiles, filters, main content) closely enough that the swap to real
 * content doesn't jump.
 */
export const DashboardSkeleton = ({
  kpis,
  filters = true,
  content = SKELETON_CONTENT.Block,
}: Props) => {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <p role="status" className="sr-only">
        Ładowanie danych…
      </p>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {kpis > 0 && (
        <div
          className={cn(
            "grid grid-cols-2 gap-4",
            kpis === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3",
          )}
        >
          {Array.from({ length: kpis }, (_, i) => (
            <Skeleton key={i} className="h-[88px]" />
          ))}
        </div>
      )}

      {filters && <Skeleton className="h-[66px]" />}

      {content === SKELETON_CONTENT.Block && <Skeleton className="h-[560px]" />}
      {content === SKELETON_CONTENT.MapWithList && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-[560px]" />
          <Skeleton className="h-[560px]" />
        </div>
      )}
      {content === SKELETON_CONTENT.TwoColumns && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-[480px]" />
          <Skeleton className="h-[480px]" />
        </div>
      )}
    </div>
  );
};
