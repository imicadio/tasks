import { Card } from "@/shared/ui/card";

/** One labelled measurement tile. */
export const Stat = ({ label, value }: { label: string; value: string }) => {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </span>
    </Card>
  );
};
