import type { SKELETON_CONTENT } from "@/shared/constants/ui";
import type { ValueOf } from "./value-of";

/** Main area under the KPI row: one tall block, a map with a side list,
 * two equal columns, or nothing. */
export type SkeletonContent = ValueOf<typeof SKELETON_CONTENT>;
