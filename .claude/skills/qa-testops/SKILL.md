---
name: qa-testops
description: Validate overall automation quality — run the smoke, regression, UI, API, and cross-browser suites, analyze failures, flaky tests, coverage, and runtime, and assess release readiness. Used by /testops (feature or repo scope). Writes deliverables/<feature>/04-TestOps.md or deliverables/_repo/TestOps.md, and appends every run to the deliverables/_repo/ledger.md trend ledger.
---

# TestOps skill

Mission: validate **overall automation quality** — not one feature's code (that was
`/auto-qa`), but whether the suite as a whole is trustworthy and the release is ready.

**Compose:** `.claude/project/stack.md` (the full run matrix) · template
`.claude/templates/04-testops.md`. The `/testops` command runs the `qa-review` protocol
after this skill.

## Run

Execute the suites relevant to the feature's scope (commands in
`.claude/project/stack.md`), typically:

- **Smoke** — `npm test` (spec) + `npm run test:bdd` (BDD)
- **Regression** — `npm run test:regression` + `npm run test:bdd:regression`
- **UI / API splits** — `npm run test:ui` / `npm run test:api` (+ BDD equivalents)
- **Cross-browser** (if the app has a UI) — the generated per-browser projects
  (`--project=ui-<app>-firefox`, `-webkit`, or the BDD equivalents)
- **Triage repros** — `npm run test:triage` / `npm run test:bdd:triage` (expected to
  fail while their defect is open — that is their job, not a suite failure)

Scope runs to the feature's app where possible (`npm run test:<app>`,
`npm run test:bdd:<app>`); in **repo scope** (`/testops repo`) run the full matrix
across all apps.

## Analyze

- **Failures** — for each: product defect vs test defect vs environment/target issue.
  Use traces and reports (`npm run report`, `npm run report:bdd:html`). External demo
  targets are slow/flaky — **re-run before declaring a flake a failure**.
- **Flaky tests** — anything that changed verdict between runs; identify the cause
  (timing, shared mutable sandbox data, exact-count assertions) and the fix
  (`expect.poll`, shape-over-count assertions, generous timeouts).
- **Coverage** — automated coverage vs the plan's `TC-*` inventory and the documented
  gaps in `03-Automation-QA.md`; call out untested high-risk areas.
- **Runtime** — total and per-suite duration, worker settings, obvious parallelism or
  duplication wins.
- **Trends** (repo scope) — read `deliverables/_repo/ledger.md`: flake rate and
  runtime per suite across the recorded runs; call out degradations (a suite trending
  slower, a test flaking across multiple runs). Skip when the ledger has fewer than
  two runs.
- **Release readiness** — a clear verdict (ready / ready-with-risks / not-ready) with
  the evidence: gate suites green, open defects (`@triage` register), coverage gaps.

Fixing a flaky or broken **test** in-place is in scope; fixing **product** defects is
not (they stay in the defect list). Larger reworks become recommendations.

## Output

`deliverables/<feature>/04-TestOps.md` (feature scope) or
`deliverables/_repo/TestOps.md` (repo scope, updated in place): execution summary
(per-suite results table), coverage, failure analysis, flaky tests, trends (repo
scope), release readiness verdict, and framework improvement suggestions — plus Review
Checklist and Review History.

**Every** run — either scope — appends one row per suite executed to the append-only
ledger `deliverables/_repo/ledger.md`
(`| Date | Scope | Suite | Pass | Fail | Flaky | Duration | Verdict |`; create it with
that header on first run; Verdict = the run's release verdict, repeated per row). CI
runs the same matrix on PRs and posts the same verdict as a sticky comment
(`.github/workflows/testops.yml`).
