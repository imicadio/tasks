import { MISSING_VALUE } from "../../constants";

/** Free-spot count, or a muted dash when the feed has no reading. */
export const SpotsCount = ({ spots }: { spots: number | null }) => {
  if (spots === null) return <span className="text-muted-foreground">{MISSING_VALUE}</span>;
  return <span className="text-base font-semibold text-foreground">{spots}</span>;
};
