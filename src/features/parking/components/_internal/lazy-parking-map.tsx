"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/shared/ui/skeleton";

/** Leaflet touches `window` on import, so the map loads client-side only. */
export const LazyParkingMap = dynamic(
  () => import("../parking-map").then((m) => m.ParkingMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  },
);
