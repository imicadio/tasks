---
name: feature-architecture-review
description: Review the current diff or branch for violations of this repo's feature-based architecture boundaries — cross-feature deep imports, logic leaking into app/, missing public index, misplaced shared code, missing colocated tests, and constants/types/helpers/sub-components declared inline in component, hook or page files instead of the constants/, types/, utils/ and components/_internal/ folders. Use when the user runs /feature-architecture-review, asks to check architecture boundaries, or before merging a feature PR. Complements the general /code-review skill but is specialized to docs/ARCHITECTURE.md's rules.
---

1. Determine the target: current diff against `main` by default, or an
   explicit branch/PR argument if given (mirror `/code-review`'s
   targeting conventions).
2. Invoke the `architecture-reviewer` agent against that target.
3. Make sure the report covers the "What goes where" rule from
   `docs/ARCHITECTURE.md` §2 (inline constants, types, helpers or extra
   components; multi-step data assembly in `app/`; helpers duplicated
   across features; untested utils) and the §6 component rules (arrow
   functions, no functions inline in JSX) — not only import boundaries.
4. Present its Violations / Warnings / Suggestions report to the user
   as-is — this skill and its underlying agent are read-only; they report,
   they don't fix.
5. If the user wants fixes applied, say so explicitly and offer to make
   the edits yourself as a separate follow-up step (not part of this
   skill's job).
