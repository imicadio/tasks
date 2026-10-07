import type { ReactNode } from "react";
import { STAT_TILE_SIZE } from "@/shared/constants/ui";
import type { StatTileSize } from "@/shared/types/stat-tile";
import { cn } from "@/shared/utils/cn";
import { Card } from "./card";

type Props = {
  label: ReactNode;
  value: ReactNode;
  /** Color identity as a small dot before the label. The value text stays
   * in ink: accent colors used as text often fail WCAG contrast — see
   * docs/decisions/0005-accessibility.md. */
  dotColor?: string;
  size?: StatTileSize;
  className?: string;
};

/** One headline number with its label (KPI tile). */
export const StatTile = ({ label, value, dotColor, size = STAT_TILE_SIZE.Large, className }: Props) => {
  return (
    <Card className={cn("flex flex-col gap-1 text-left", className)}>
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {dotColor && (
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
        )}
        {label}
      </span>
      <span
        className={cn(
          "font-semibold tabular-nums text-foreground",
          size === STAT_TILE_SIZE.Large ? "text-3xl" : "text-2xl",
        )}
      >
        {value}
      </span>
    </Card>
  );
};
