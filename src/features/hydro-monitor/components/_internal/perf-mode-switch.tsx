import { Switch } from "@/shared/ui/switch";
import type { PerfMode } from "../../types";

type Props = {
  value: PerfMode;
  onChange: (value: PerfMode) => void;
};

/** Toggles the naive (unoptimized) rendering for the perf case study. */
export const PerfModeSwitch = ({ value, onChange }: Props) => {
  const handleCheckedChange = (naive: boolean) =>
    onChange(naive ? "naive" : "optimized");

  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <Switch checked={value === "naive"} onCheckedChange={handleCheckedChange} />
      Tryb naiwny (demo wydajności) — patrz README.md
    </label>
  );
};
