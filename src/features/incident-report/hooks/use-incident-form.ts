"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { wait } from "@/shared/utils/wait";
import { DISTRICTS, LAST_STEP, SUBMIT_DELAY_MS } from "../constants";
import { validateStep } from "../schemas";
import { useIncidentReportStore } from "../store";
import type { FormStep, Incident, StepErrors } from "../types";
import { firstInvalidFieldId } from "../utils/first-invalid-field";

/**
 * The report form's flow: per-step validation with focus on the first
 * invalid field, moving between steps (focusing the new step's heading),
 * and the simulated submit. The draft itself lives in the store.
 */
export function useIncidentForm(onSubmitted: (incident: Incident) => void) {
  const { draft, step, setField, setLocation, setStep, submit } = useIncidentReportStore(
    useShallow((state) => ({
      draft: state.draft,
      step: state.step,
      setField: state.setField,
      setLocation: state.setLocation,
      setStep: state.setStep,
      submit: state.submit,
    })),
  );
  const [errors, setErrors] = useState<StepErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Incident | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const movedFocus = useRef(false);

  // Focus the new step's heading after Dalej/Wstecz — but not on the first
  // render, which would yank focus away from the skip link / nav.
  useEffect(() => {
    if (movedFocus.current) headingRef.current?.focus();
  }, [step]);

  const goTo = (next: FormStep) => {
    movedFocus.current = true;
    setErrors({});
    setStep(next);
  };

  const validateCurrent = (): boolean => {
    const stepErrors = validateStep(step, draft);
    setErrors(stepErrors);
    const target = firstInvalidFieldId(step, stepErrors);
    if (target === null) return true;
    // After React commits the error markup, so aria-describedby resolves.
    requestAnimationFrame(() => document.getElementById(target)?.focus());
    return false;
  };

  const submitReport = async () => {
    setSubmitting(true);
    await wait(SUBMIT_DELAY_MS);
    const incident = submit();
    setSubmitting(false);
    setErrors({});
    setSubmitted(incident);
    onSubmitted(incident);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || !validateCurrent()) return;
    if (step < LAST_STEP) return goTo((step + 1) as FormStep);
    await submitReport();
  };

  const pickDistrict = (districtId: string) => {
    setField("district", districtId);
    const district = DISTRICTS.find((d) => d.id === districtId);
    if (district) setLocation(district.lat, district.lon);
    setErrors((current) => ({ ...current, location: undefined }));
  };

  return {
    draft,
    step,
    setField,
    errors,
    submitting,
    submitted,
    headingRef,
    handleSubmit,
    handleBack: () => goTo((step - 1) as FormStep),
    handleReset: () => setSubmitted(null),
    pickDistrict,
  };
}
