"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/button";

type Props = {
  error: Error & { digest?: string };
  retry: () => void;
};

/** Shown when a dashboard's server render fails — typically an upstream
 * public API (IMGW, GUS, Tristar, ckan) timing out or erroring. */
export default function DashboardError({ error, retry }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold text-foreground">
        Nie udało się wczytać danych
      </h1>
      <p className="text-muted-foreground">
        Źródło danych nie odpowiedziało albo zwróciło błąd. Spróbuj ponownie
        za chwilę.
      </p>
      <Button onClick={() => retry()}>Spróbuj ponownie</Button>
    </div>
  );
}
