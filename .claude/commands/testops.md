# /testops

Run the **TestOps specialist** — validate overall automation quality and release
readiness — then own the complete review of the result. Stage 4 of 4.

Input `$ARGUMENTS`: `<feature>` (optionally scope notes, e.g. "regression only" or
"whole repo").

## Step 1 — Generate

1. Resolve `<feature>`. **Precondition**: `deliverables/<feature>/03-Automation-QA.md`
   must exist — running this command implicitly accepts it. If it's missing, stop and
   point the user at `/auto-qa`.
2. Run the **qa-testops** skill (delegable to the `qa-testops` subagent). It runs the
   relevant suites — smoke, regression, UI, API, cross-browser where applicable, plus
   the `@triage` register — analyzes failures (product vs test vs environment), flaky
   tests (re-run before calling a flake a failure), coverage vs the plan, and runtime,
   and produces a release-readiness verdict. Writes
   `deliverables/<feature>/04-TestOps.md`.

## Steps 2–6 — Review (the `qa-review` skill, in the main conversation)

- **Open** the deliverable automatically (`code` + a clickable link).
- **Executive Summary** in chat: per-suite results, failures by cause, flaky tests,
  runtime, the release-readiness verdict.
- **Review Checklist** from `.claude/checklists/review-testops.md`, each item ✓/✗.
- **Interactive review** — one question per turn (recommendation + reasoning + impact);
  typical judgment calls here: the release verdict itself, each flake's disposition
  (fix / quarantine / accept), whether a failure is product or test, which framework
  improvements to prioritize.
- **Feedback loop** — "Do you have any additional feedback?" until there is none.

Then **stop** — this is the final stage. The cycle for the next feature starts again at
`/test-plan`.
