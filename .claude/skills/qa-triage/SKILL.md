---
name: qa-triage
description: Handle failed manual cases. A fail case is automated as a @triage reproduction test that asserts the INTENDED result (so it fails = a one-command replay with a trace) and is excluded from smoke/regression. Consumed by qa-manual and qa-automation; the repro contract the Bug Investigator (/investigate) builds on.
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

## On fix (retag rule)

The repro asserts the intended result, so a landed fix makes it **pass**. That is the
signal to promote it: remove `@triage`, tag it `@regression` (it is now a true
regression test), and set the defect's row in `02-Manual-QA.md § Possible Defects` to
`fixed`.

## Handoff

Defects are documented in `deliverables/<feature>/02-Manual-QA.md` § Possible Defects
(and re-surfaced by `/testops` in the release-readiness verdict). Full defect triage —
root-cause analysis, the structured bug report, fix verification — is the
**Bug Investigator**: `/investigate <feature>` (the `qa-investigate` skill). It replays
this skill's repro for fresh evidence and appends to
`deliverables/<feature>/05-Investigations.md`.
