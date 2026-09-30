# 0001: Record architecture decisions

## Status

Accepted

## Context

This codebase exists partly as a deliberate response to interview feedback
that called out, among other things, an inability to walk through concrete
architectural decisions and their trade-offs on demand. A decision that
lives only in a pull request description or in someone's memory is not
retrievable months later, and "why did we do it this way" tends to get
answered with a shrug or a guess once the person who made the call has
moved on — that is itself a form of technical debt: the debt of lost
rationale.

## Decision

Significant, hard-to-reverse decisions are recorded as short Architecture
Decision Records (ADRs) in `docs/decisions/`, numbered sequentially, never
edited after acceptance (a changed decision gets a new ADR that supersedes
the old one). Each one follows Status / Context / Decision / Consequences.
"Significant" means: introducing a new dependency that shapes how a whole
class of code gets written (a state library, a validation library), a
choice with a real trade-off rather than an obviously-correct default, or a
decision likely to be second-guessed later without a record of why it was
made.

## Consequences

- Every ADR is a concrete artifact for exactly the kind of "walk me through
  a decision you made and its trade-offs" question this project exists to
  answer.
- Overhead: writing one takes real time, and not every decision deserves
  one — see `docs/TECH_DEBT.md` for the lighter-weight log of shortcuts
  that don't rise to this level.
- Superseding via a new ADR (rather than editing) keeps the history honest:
  you can see that a decision changed and read why, instead of the record
  silently rewriting itself.
