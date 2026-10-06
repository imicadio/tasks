---
name: create-feature
description: Scaffold a new feature module following this repo's feature-based architecture (docs/ARCHITECTURE.md). Use when the user runs /create-feature <name>, or asks to create, add, or scaffold a new feature such as billing, notifications, or settings.
---

1. Parse `<feature-name> [one-line description]` from the arguments. If the
   name is missing, ask for it.
2. Normalize the name to kebab-case; check it doesn't already exist under
   `src/features/` and isn't already in `docs/ARCHITECTURE.md`'s Feature
   Index.
3. Confirm route/API/client-state needs only if genuinely ambiguous from
   the description; otherwise default to "UI + one route, no API, no
   store".
4. Invoke the `feature-scaffolder` agent with the feature name, purpose,
   and these decisions, instructing it to read `docs/ARCHITECTURE.md`
   first (it already knows to, but state it explicitly) — in particular
   the `constants/` / `types/` / `utils/` folder layout, the "What goes
   where" rule in §2, and §6: arrow functions, named handlers instead of
   functions inline in JSX, and the engineering principles (SRP with
   hooks for state, DRY via `src/shared/`, YAGNI, KISS, early returns,
   ≤100 lines of code per component file).
5. After it finishes, run `npm run lint` and report the created file tree
   plus what the user should fill in next (real logic, real tests).
