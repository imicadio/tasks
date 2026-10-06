import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { FormStep } from "../../types";

type Props = {
  step: FormStep;
  disabled: boolean;
  onClick: () => void;
};

/** "Wstecz" on later steps; on the first step, a note about autosave instead. */
export const BackButton = ({ step, disabled, onClick }: Props) => {
  if (step === 0) {
    return (
      <span className="text-xs text-muted-foreground">
        Szkic zapisuje się automatycznie.
      </span>
    );
  }
  return (
    <Button type="button" variant="outline" disabled={disabled} onClick={onClick}>
      <ArrowLeft data-icon="inline-start" aria-hidden="true" />
      Wstecz
    </Button>
  );
};
