import { Card } from "@/shared/ui/card";
import type { Incident } from "../../types";
import { FormOrPlaceholder } from "./form-or-placeholder";

export type FormPanelProps = {
  hydrated: boolean;
  onSubmitted: (incident: Incident) => void;
};

/** The form card; a placeholder until the saved draft is loaded, so the
 * form never flashes empty and then refills. */
export const FormPanel = ({ hydrated, onSubmitted }: FormPanelProps) => {
  return (
    <section aria-labelledby="incident-form-heading">
      <Card className="flex flex-col gap-4 p-5">
        <h2 id="incident-form-heading" className="sr-only">
          Formularz zgłoszenia
        </h2>
        <FormOrPlaceholder hydrated={hydrated} onSubmitted={onSubmitted} />
      </Card>
    </section>
  );
};
