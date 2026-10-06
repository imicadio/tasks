import type { CSSProperties } from "react";
import type { VirtualItem } from "@tanstack/react-virtual";

/** Absolutely positions one virtualized row at its offset in the list. */
export function virtualRowStyle(row: Pick<VirtualItem, "size" | "start">): CSSProperties {
  return {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: row.size,
    transform: `translateY(${row.start}px)`,
  };
}
