import type { ReactNode } from "react";
import { hintId } from "../../utils/field-ids";
import { FieldError } from "./field-error";

type Props = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
};

export const Field = ({ id, label, hint, error, optional, children }: Props) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground"> (opcjonalnie)</span>
        )}
      </label>
      {hint && (
        <p id={hintId(id)} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {children}
      <FieldError id={id} message={error} />
    </div>
  );
};
