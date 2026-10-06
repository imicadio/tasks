import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { LAST_STEP } from "../../constants";
import type { FormStep } from "../../types";

type Props = {
  step: FormStep;
  submitting: boolean;
};

/** "Dalej" until the last step, then "Wyślij zgłoszenie". */
export const NextButton = ({ step, submitting }: Props) => {
  if (step < LAST_STEP) {
    return (
      <Button type="submit" size="lg">
        Dalej
        <ArrowRight data-icon="inline-end" aria-hidden="true" />
      </Button>
    );
  }
  return (
    <Button type="submit" size="lg" disabled={submitting}>
      <Send data-icon="inline-start" aria-hidden="true" />
      {submitting ? "Wysyłanie…" : "Wyślij zgłoszenie"}
    </Button>
  );
};
