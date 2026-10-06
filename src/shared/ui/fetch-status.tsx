type Props = {
  isFetching: boolean;
  isError: boolean;
};

/** Inline "refreshing…" / "failed to fetch" note for a filter bar. */
export const FetchStatus = ({ isFetching, isError }: Props) => {
  if (isError) {
    return (
      <span className="text-sm text-destructive">Nie udało się pobrać danych.</span>
    );
  }
  if (isFetching) {
    return <span className="text-sm text-muted-foreground">Odświeżanie…</span>;
  }
  return null;
};
