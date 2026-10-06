import type { FormStep, StepProps } from "../../types";
import { ContactStep } from "./contact-step";
import { DetailsStep } from "./details-step";
import { LocationStep } from "./location-step";

type Props = StepProps & {
  step: FormStep;
  onPickDistrict: (districtId: string) => void;
};

/** The fields of the form's current step. */
export const CurrentStep = ({ step, onPickDistrict, ...props }: Props) => {
  if (step === 0) return <DetailsStep {...props} />;
  if (step === 1) return <LocationStep {...props} onPickDistrict={onPickDistrict} />;
  return <ContactStep {...props} />;
};
