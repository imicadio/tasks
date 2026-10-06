import { Check } from "lucide-react";

type Props = {
  done: boolean;
  number: number;
};

/** Content of a step's circle: a check once completed, its number before. */
export const StepMarker = ({ done, number }: Props) => {
  if (done) return <Check className="size-3.5" />;
  return number;
};
