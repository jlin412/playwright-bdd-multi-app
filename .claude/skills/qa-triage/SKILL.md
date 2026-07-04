---
name: qa-triage
description: Handle failed manual cases. A fail case is automated as a @triage reproduction test that asserts the INTENDED result (so it fails = a one-command replay with a trace) and is excluded from smoke/regression. Consumed by qa-manual and qa-automation; the seam for a future Bug Investigator workflow.
---

# QA Triage skill

A case with status `fail` is a **defect** — but it stays first-class and is still
automated. This skill is the single home for the `@triage` rules that the manual
(`/manual-qa`) and automation (`/auto-qa`) phases apply.

## Rules

- Keep the `TC-*` ID; tag the case/test `@triage`.
- Automate it as a **reproduction** test that asserts the **intended** result. It
  currently fails — that failure *is* the repro (a one-command replay with a Playwright
  trace).
- **Never** assert the buggy observed behavior.
- `@triage` is **excluded from both `@smoke` and `@regression`**. Run on demand:
  `npm run test:triage` (spec) / `npm run test:bdd:triage` (BDD).
- Never also tag a `@triage` test `@smoke`/`@regression`.
- `blocked` / `not-run` cases are **not** automated — they are documented coverage gaps.

## Handoff

Defects are documented in `deliverables/<feature>/02-Manual-QA.md` § Possible Defects
(and re-surfaced by `/testops` in the release-readiness verdict). Full defect triage —
root-cause analysis, structured bug reports, fix verification — is a future
**Bug Investigator** workflow that will build on this seam. For now this skill defines
the repro contract the workflow already follows.
