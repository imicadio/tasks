import { errorId } from "../../utils/field-ids";

type Props = { id: string; message?: string };

export const FieldError = ({ id, message }: Props) => {
  if (!message) return null;
  return (
    <p id={errorId(id)} className="text-sm font-medium text-destructive">
      {message}
    </p>
  );
};
