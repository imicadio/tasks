import { Skeleton } from "@/shared/ui/skeleton";
import { IncidentForm } from "../incident-form";
import type { FormPanelProps } from "./form-panel";

/** The form once the saved draft is loaded, a placeholder before. */
export const FormOrPlaceholder = ({ hydrated, onSubmitted }: FormPanelProps) => {
  if (hydrated) return <IncidentForm onSubmitted={onSubmitted} />;
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};
