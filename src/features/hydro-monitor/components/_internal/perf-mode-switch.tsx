import { Switch } from "@/shared/ui/switch";
import { PERF_MODE } from "../../constants";
import type { PerfMode } from "../../types";

type Props = {
  value: PerfMode;
  onChange: (value: PerfMode) => void;
};

/** Toggles the naive (unoptimized) rendering for the perf case study. */
export const PerfModeSwitch = ({ value, onChange }: Props) => {
  const handleCheckedChange = (naive: boolean) =>
    onChange(naive ? PERF_MODE.Naive : PERF_MODE.Optimized);

  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <Switch checked={value === PERF_MODE.Naive} onCheckedChange={handleCheckedChange} />
      Tryb naiwny (demo wydajności) — patrz README.md
    </label>
  );
};
