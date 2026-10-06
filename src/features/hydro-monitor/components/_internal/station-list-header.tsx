/** Column headings above the station rows (visual only — the screen-reader
 * table has its own). */
export const StationListHeader = () => {
  return (
    <div className="grid h-9 grid-cols-[auto_1.4fr_1fr_1.2fr_auto] items-center gap-3 border-b border-border px-3 text-xs font-medium text-muted-foreground">
      <span className="sr-only">Ulubione</span>
      <span>Stacja</span>
      <span>Województwo</span>
      <span>Stan wody</span>
      <span>Status</span>
    </div>
  );
};
