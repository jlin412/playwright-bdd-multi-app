# /auto-qa

Run the **Automation QA specialist** — convert the approved Gherkin into high-quality
Playwright automation — then own the complete review of the result. Stage 3 of 4.

Input `$ARGUMENTS`: `<feature>` (optionally scope notes, e.g. "smoke cases only").

## Step 1 — Generate

1. Resolve `<feature>`. **Precondition**: `deliverables/<feature>/02-Manual-QA.md`
   must exist — running this command implicitly accepts it. If it's missing, stop and
   point the user at `/manual-qa`.
2. Run the **qa-automation** skill (delegable to the `qa-automation` subagent). It
   evaluates **every** manual case (maximizing automation; gating `fail` cases into
   `@triage` repros via qa-triage), reuses existing steps/POM/SOM/fixtures first,
   generates code into `apps/<app>/` per `.claude/project/conventions.md`, and iterates
   **generate → run → fix** locally until stable (`npx tsc --noEmit` + the app's
   test scripts). Writes `deliverables/<feature>/03-Automation-QA.md`; every
   non-automated case gets a why / approaches / effort / recommendation entry.

## Steps 2–6 — Review (the `qa-review` skill, in the main conversation)

- **Open** the deliverable automatically (`code` + a clickable link).
- **Executive Summary** in chat: automation coverage (automated vs not, per `TC-*`),
  files created/modified, run results, framework improvements observed.
- **Review Checklist** from `.claude/checklists/review-auto-qa.md`, each item ✓/✗.
- **Interactive review** — one question per turn (recommendation + reasoning + impact);
  typical judgment calls here: cases left non-automated (agree with the reasoning?),
  tag/suite placement, reuse-vs-new decisions, any flaky test kept vs quarantined.
- **Feedback loop** — "Do you have any additional feedback?" until there is none
  (feedback may target the deliverable **or** the generated code — update, re-run, and
  report).

Then **stop**. Do not start the TestOps validation. Next, when the user is ready:
`/testops <feature>` (running it implicitly accepts this automation).
