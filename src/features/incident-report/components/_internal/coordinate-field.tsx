import { CoordinateInput } from "./coordinate-input";

type Props = {
  id: "lat" | "lon";
  label: string;
  placeholder: string;
  value: number | null;
  invalid: boolean;
  describedBy: string | undefined;
  onChange: (value: number | null) => void;
};

/** One labelled coordinate input inside the coordinates fieldset. */
export const CoordinateField = ({
  id,
  label,
  placeholder,
  value,
  invalid,
  describedBy,
  onChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-foreground">
        {label}
      </label>
      <CoordinateInput
        id={id}
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={onChange}
      />
    </div>
  );
};
