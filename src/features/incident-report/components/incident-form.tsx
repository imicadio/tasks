"use client";

import { STEPS } from "../constants";
import { useIncidentForm } from "../hooks/use-incident-form";
import type { Incident } from "../types";
import { BackButton } from "./_internal/back-button";
import { CurrentStep } from "./_internal/current-step";
import { NextButton } from "./_internal/next-button";
import { Stepper } from "./_internal/stepper";
import { SubmitSuccess } from "./_internal/submit-success";

type Props = {
  onSubmitted: (incident: Incident) => void;
};

/** The three-step report form; see useIncidentForm for the flow. */
export const IncidentForm = ({ onSubmitted }: Props) => {
  const {
    draft,
    step,
    setField,
    errors,
    submitting,
    submitted,
    headingRef,
    handleSubmit,
    handleBack,
    handleReset,
    pickDistrict,
  } = useIncidentForm(onSubmitted);

  if (submitted) {
    return <SubmitSuccess incident={submitted} onReset={handleReset} />;
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Stepper current={step} />

      <div className="flex flex-col gap-5">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-lg font-semibold text-foreground outline-none"
        >
          {`Krok ${step + 1} z ${STEPS.length}: ${STEPS[step].title}`}
        </h2>
        <CurrentStep
          step={step}
          draft={draft}
          errors={errors}
          setField={setField}
          onPickDistrict={pickDistrict}
        />
      </div>

      <div className="flex items-center justify-between gap-2 border-t pt-4">
        <BackButton step={step} disabled={submitting} onClick={handleBack} />
        <NextButton step={step} submitting={submitting} />
      </div>
    </form>
  );
};
