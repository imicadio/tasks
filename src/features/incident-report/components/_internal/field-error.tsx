import { errorId } from "../../utils/field-ids";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={errorId(id)} className="text-sm font-medium text-destructive">
      {message}
    </p>
  );
}
