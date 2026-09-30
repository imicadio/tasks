---
name: feature-architecture-review
description: Review the current diff or branch for violations of this repo's feature-based architecture boundaries — cross-feature deep imports, logic leaking into app/, missing public index, misplaced shared code, missing colocated tests. Use when the user runs /feature-architecture-review, asks to check architecture boundaries, or before merging a feature PR. Complements the general /code-review skill but is specialized to docs/ARCHITECTURE.md's rules.
---

1. Determine the target: current diff against `main` by default, or an
   explicit branch/PR argument if given (mirror `/code-review`'s
   targeting conventions).
2. Invoke the `architecture-reviewer` agent against that target.
3. Present its Violations / Warnings / Suggestions report to the user
   as-is — this skill and its underlying agent are read-only; they report,
   they don't fix.
4. If the user wants fixes applied, say so explicitly and offer to make
   the edits yourself as a separate follow-up step (not part of this
   skill's job).
