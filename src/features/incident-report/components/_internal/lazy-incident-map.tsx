"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/shared/ui/skeleton";

/** Leaflet touches `window` on import, so the map loads client-side only. */
export const LazyIncidentMap = dynamic(
  () => import("../incident-map").then((m) => m.IncidentMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  },
);
