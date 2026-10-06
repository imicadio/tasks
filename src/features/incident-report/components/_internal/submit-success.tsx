import { useEffect, useRef } from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { Incident } from "../../types";

type Props = {
  incident: Incident;
  onReset: () => void;
};

/** Confirmation shown after a report is stored; takes focus so screen
 * readers announce it. */
export const SubmitSuccess = ({ incident, onReset }: Props) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-start gap-4 py-2">
      <div
        role="status"
        className="flex w-full items-start gap-3 rounded-lg border border-status-good/50 bg-status-good/10 p-4"
      >
        <CircleCheck
          aria-hidden="true"
          className="mt-0.5 size-6 shrink-0 text-status-good"
        />
        <div className="flex flex-col gap-1">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-lg font-semibold text-foreground outline-none"
          >
            Zgłoszenie zostało wysłane pomyślnie
          </h2>
          <p className="text-sm text-foreground">
            Numer zgłoszenia:{" "}
            <strong className="font-mono">{incident.reference}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Incydent „{incident.title}” jest już widoczny na mapie jako{" "}
            <strong className="text-foreground">NOWY INCYDENT</strong>.
          </p>
        </div>
      </div>
      <Button variant="outline" onClick={onReset}>
        Zgłoś kolejny incydent
      </Button>
    </div>
  );
};
