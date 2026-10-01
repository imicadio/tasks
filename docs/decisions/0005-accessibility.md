# 0005: Accessibility (WCAG 2.1 AA) strategy

## Status

Accepted

## Context

This app must be accessible under WCAG — a hard requirement, not a nice-to-have
(and, given this project exists partly as a portfolio piece aimed at a public
institution, a legally-relevant one: Polish public-sector digital services are
required to meet WCAG 2.1 AA under the Act on digital accessibility of
websites and mobile applications of public entities, which transposes the EU
Web Accessibility Directive). "We used shadcn/Radix-flavored components, so
it's probably fine" is not an audit — several real violations existed in this
codebase despite using accessible-by-default component primitives throughout.

## Decision

### Audit method: automated scan + manual review, not one or the other

An automated tool (axe-core, run live in a real browser against `/`,
`/road-accidents`, `/hydrologia`, `/pogoda`, and `/pogoda/[id]`) catches
structural and contrast issues a human reviewer easily misses or can't
compute precisely (exact contrast ratios). But it has real, known blind
spots — it cannot judge whether `<html lang="en">` matches the actual
language of the content (SC 3.1.1), because that requires understanding
*meaning*, not just markup structure. That specific bug (the entire app's
content is Polish; the root layout still had the create-next-app default
`lang="en"`) was caught only by manual review, not by axe. The practice
going forward: run axe on every new page, but don't treat a clean axe run
as "done" — it is a floor, not a ceiling.

### What axe actually found, and what was fixed

| Finding | Severity | Fix |
|---|---|---|
| `<html lang="en">` on fully-Polish content | Not axe-detectable (manual) | Changed to `lang="pl"` |
| Select triggers (status/voivodeship/sort/dir filters) had no accessible name | Critical (`button-name`) | Added explicit `aria-label` per trigger; also fixed the underlying cause — `<Select.Value>` with no render function was displaying the raw enum value ("temperatureC", "desc") as visible text too, not just failing the accessible-name check |
| Status badges (hydro-monitor rows) at 2.75:1, well under 4.5:1 | Serious (`color-contrast`) | Stopped using `STATUS_COLORS` as text color; label text stays in a fixed ink token, a small colored dot carries the color identity instead |
| KPI tile numbers using metric/status accent colors as text — down to 1.78:1 for the warning/injured hues | Serious (`color-contrast`, one instance caught only via manual contrast calculation since axe marks single-digit text "incomplete" rather than "violation") | Same fix: ink text + colored dot, applied consistently across both dashboards' KPI rows |
| `--muted-foreground` (shadcn's own default, 3.45:1) and `--chart-muted` (3.50:1) both under 4.5:1 on the light surface | Found by manual contrast calculation, used pervasively (card subtitles, stat labels, chart axis ticks) | Darkened both tokens in `globals.css`'s light-mode block (dark mode already passed) |

The common thread in three of these four: **a color validated for use as a
chart mark or accent (see `docs/decisions/0003...` — no, see the `dataviz`
skill's palette, which documents mark-fill contrast against a surface) is
not automatically safe as *text* color.** Marks and text have different
WCAG criteria (1.4.11 non-text contrast, 3:1, vs. 1.4.3 text contrast,
4.5:1/3:1-large), and a color chosen for the former was reused for the
latter without re-checking. The fix pattern now applied everywhere in this
codebase: **identity colors live in a small decorative dot/fill next to the
text; the text itself always stays in an ink token** (`--chart-ink`,
`--foreground`, etc.), never in a data-viz accent.

### The virtualized list: a real, deliberate trade-off

`hydro-monitor`'s station list (`~900` rows) is virtualized plain `<div>`s
with absolute positioning (see `docs/decisions/0004...`), which has no
native table semantics a screen reader can navigate by row/column.
Retrofitting ARIA `role="table"/"row"/"cell"` onto a windowed,
absolutely-positioned list is exactly the kind of custom-widget work the
WAI-ARIA Authoring Practices warn about: easy to get subtly wrong (e.g. the
virtualizer's spacer `<div>` sitting between the row-group and the rows
breaks the required parent-child relationship unless explicitly marked
`role="presentation"`), and "no ARIA is better than bad ARIA" since a
broken custom grid can confuse assistive tech worse than plain markup
would.

Instead: the visual, virtualized list stays exactly as it is (fully
keyboard-operable on its own merits — real `<button>`s, real `<a>`s, just
without row/column semantics), and a **real, fully-semantic `<table>`**
containing the complete (non-virtualized) dataset is added alongside it,
visually hidden (`sr-only`) but available to assistive tech, with a proper
`<caption>` and `<th scope="col">`. This is additive, not a replacement — it
reuses the exact pattern already established in `road-accidents` and
`weather` (a chart/list paired with a full data table), rather than
inventing a new mechanism, and it sidesteps the custom-ARIA-grid risk
entirely by relying on table semantics every browser and screen reader
already implements correctly.

### Known gap from this trade-off

The hidden table is currently **read-only** — favoriting a station is only
available from the visual virtualized list, not from the table assistive
tech sees. Logged explicitly in `docs/TECH_DEBT.md` rather than silently
shipped as a limitation nobody documented.

### Enforcement: `jest-axe` in the test suite, not just a one-time manual pass

A one-time audit answers "is it accessible today." It doesn't stop the next
PR from reintroducing the exact badge/KPI contrast mistake this ADR just
fixed. `jest-axe` (`toHaveNoViolations`) now runs against the three
dashboard components' rendered output as part of the normal test suite —
see `docs/ARCHITECTURE.md` §7's testing conventions. Its `color-contrast`
rule is disabled in those tests specifically: jsdom doesn't do real
layout/paint, so axe can't compute real contrast there — contrast is a
live-browser concern, verified manually (and CSS-token-level, not
per-component) the way this ADR records above, not something the unit
suite can own. The suite still catches the structural class of bug (missing
accessible names, invalid ARIA, duplicate ids, etc.) on every run.

## Consequences

- Every future interactive component gets an axe check in its test almost
  for free (a few lines), catching the `button-name`-class of bug before
  it ships, not after a manual re-audit.
- Contrast remains a live-browser, manual-verification concern. This ADR's
  own table is the record of what was checked and when — if the color
  tokens in `globals.css` change again, re-run axe (or the dataviz skill's
  `validate_palette.js` for data-viz marks specifically) rather than
  assuming a previously-fine value stays fine.
- The sr-only-table-for-virtualized-lists pattern established here
  (`hydro-monitor`) is the template for any future feature that virtualizes
  a large list: don't hand-roll ARIA grid roles, add a real hidden table
  instead.
- `lang="pl"` is a hardcoded constant on `<html>`, not derived from
  anything — correct today because this app is Polish-only with no i18n.
  Revisit if the app ever gains a language switcher.
