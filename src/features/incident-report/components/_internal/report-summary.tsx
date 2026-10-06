import type { IncidentDraft } from "../../types";
import { draftSummary } from "../../utils/draft-summary";

/** Read-only recap of the draft before it's sent. */
export const ReportSummary = ({ draft }: { draft: IncidentDraft }) => {
  const summary = draftSummary(draft);

  return (
    <section aria-labelledby="summary-heading" className="rounded-lg bg-muted/50 p-4">
      <h3 id="summary-heading" className="mb-3 text-sm font-semibold text-foreground">
        Podsumowanie zgłoszenia
      </h3>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-muted-foreground">Kategoria</dt>
        <dd className="text-foreground">{summary.category}</dd>
        <dt className="text-muted-foreground">Zagrożenie</dt>
        <dd className="text-foreground">{summary.severity}</dd>
        <dt className="text-muted-foreground">Tytuł</dt>
        <dd className="text-foreground">{summary.title}</dd>
        <dt className="text-muted-foreground">Miejsce</dt>
        <dd className="text-foreground">{summary.place}</dd>
        <dt className="text-muted-foreground">Kiedy</dt>
        <dd className="text-foreground">{summary.when}</dd>
      </dl>
    </section>
  );
};
