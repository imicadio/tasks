"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { wait } from "@/shared/utils/wait";
import {
  DISTRICTS,
  LAST_STEP,
  STEP_FIELDS,
  STEPS,
  SUBMIT_DELAY_MS,
} from "../constants";
import { validateStep } from "../schemas";
import { useIncidentReportStore } from "../store";
import type { FormStep, Incident, StepErrors } from "../types";
import { ContactStep } from "./_internal/contact-step";
import { DetailsStep } from "./_internal/details-step";
import { LocationStep } from "./_internal/location-step";
import { Stepper } from "./_internal/stepper";
import { SubmitSuccess } from "./_internal/submit-success";

export const IncidentForm = ({
  onSubmitted,
}: {
  onSubmitted: (incident: Incident) => void;
}) => {
  const draft = useIncidentReportStore((state) => state.draft);
  const step = useIncidentReportStore((state) => state.step);
  const setField = useIncidentReportStore((state) => state.setField);
  const setLocation = useIncidentReportStore((state) => state.setLocation);
  const setStep = useIncidentReportStore((state) => state.setStep);
  const submit = useIncidentReportStore((state) => state.submit);

  const [errors, setErrors] = useState<StepErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Incident | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const movedFocus = useRef(false);

  // Move focus to the new step's heading after Dalej/Wstecz — but not on the
  // first render, which would yank focus away from the skip link / nav.
  useEffect(() => {
    if (!movedFocus.current) return;
    headingRef.current?.focus();
  }, [step]);

  const goTo = (next: FormStep) => {
    movedFocus.current = true;
    setErrors({});
    setStep(next);
  };

  /** Validates the current step; on failure shows errors and focuses the
   * first invalid field. */
  const validateCurrent = (): boolean => {
    const stepErrors = validateStep(step, draft);
    setErrors(stepErrors);
    const first = STEP_FIELDS[step].find((field) => stepErrors[field]);
    if (!first) return true;
    // After React commits the error markup, so aria-describedby resolves.
    // `location` is the coordinates fieldset — focus its first input.
    const target = first === "location" ? "lat" : first;
    requestAnimationFrame(() => document.getElementById(target)?.focus());
    return false;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || !validateCurrent()) return;
    if (step < LAST_STEP) {
      goTo((step + 1) as FormStep);
      return;
    }
    setSubmitting(true);
    await wait(SUBMIT_DELAY_MS);
    const incident = submit();
    setSubmitting(false);
    setErrors({});
    setSubmitted(incident);
    onSubmitted(incident);
  };

  const pickDistrict = (districtId: string) => {
    setField("district", districtId);
    const district = DISTRICTS.find((d) => d.id === districtId);
    if (district) setLocation(district.lat, district.lon);
    setErrors((current) => ({ ...current, location: undefined }));
  };

  if (submitted) {
    return (
      <SubmitSuccess incident={submitted} onReset={() => setSubmitted(null)} />
    );
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
        {step === 0 && <DetailsStep draft={draft} errors={errors} setField={setField} />}
        {step === 1 && (
          <LocationStep
            draft={draft}
            errors={errors}
            setField={setField}
            onPickDistrict={pickDistrict}
          />
        )}
        {step === 2 && <ContactStep draft={draft} errors={errors} setField={setField} />}
      </div>

      <div className="flex items-center justify-between gap-2 border-t pt-4">
        {step > 0 ? (
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => goTo((step - 1) as FormStep)}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Wstecz
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">
            Szkic zapisuje się automatycznie.
          </span>
        )}
        {step < LAST_STEP ? (
          <Button type="submit" size="lg">
            Dalej
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={submitting}>
            <Send data-icon="inline-start" aria-hidden="true" />
            {submitting ? "Wysyłanie…" : "Wyślij zgłoszenie"}
          </Button>
        )}
      </div>
    </form>
  );
};
