---
name: document-feature
description: Regenerate a feature's README.md (purpose, public API surface, owned routes, dependencies) from its current code and keep docs/ARCHITECTURE.md's Feature Index in sync. Use when the user runs /document-feature <name>, after finishing work on a feature, or asks to update feature docs or sync architecture docs.
---

1. Determine the feature name: from the argument, or infer it from
   `git diff` if working on one feature, or ask.
2. Read `src/features/<name>/index.ts` to enumerate the actual current
   public exports.
3. Grep `src/app/**` for `@/features/<name>` to find the routes that
   consume it (its "owned routes").
4. Grep the feature's own files for `from "@/features/"` to find its
   declared dependencies on other features. Flag any dependency beyond the
   documented "may depend on a foundational feature" exception in
   `docs/ARCHITECTURE.md` §3 for the user to review.
5. Regenerate `src/features/<name>/README.md` from a fixed template
   (Purpose / Public API / Owned routes / Depends on), merging in — not
   clobbering — any existing free-text "Purpose" section a human already
   wrote.
6. Update or insert this feature's single row in `docs/ARCHITECTURE.md`
   §9's Feature Index table.
7. Report the docs diff to the user.
