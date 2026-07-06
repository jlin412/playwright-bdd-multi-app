# /manual-qa

Run the **Manual QA specialist** — validate the feature as a skilled manual tester and
produce the approved specification for automation — then own the complete review of the
result. Stage 2 of 4.

Input `$ARGUMENTS`: `<feature>` (optionally extra focus notes).

## Step 1 — Generate

1. Resolve `<feature>`. **Precondition**: `deliverables/<feature>/01-Test-Plan.md`
   must exist — running this command implicitly accepts it. If it's missing, stop and
   point the user at `/test-plan`.
2. Run the **qa-manual** skill (delegable to the `qa-manual` subagent). It explores and
   validates live — Playwright MCP browser for UI, real HTTP for API; validation and
   discovery, **not** automation generation — executing happy paths, negatives, and
   edge cases per `TC-*`, recording intended vs actual + status, then specifies the
   coverage reuse-first — **UI** as Gherkin in `apps/<app>/features/` (unimplemented
   scenarios tagged `@manual`), **API** as spec cases in `apps/<app>/specs/api/` (no
   feature files). Writes `deliverables/<feature>/02-Manual-QA.md`.

## Steps 2–6 — Review (the `qa-review` skill, in the main conversation)

- **Open** the deliverable automatically (`code` + a clickable link).
- **Executive Summary** in chat: cases executed (pass/fail/blocked/not-run), possible
  defects, ambiguities, discovered cases, files created/updated (UI Gherkin / API specs).
- **Review Checklist** from `.claude/checklists/review-manual-qa.md`, each item ✓/✗.
- **Interactive review** — one question per turn (recommendation + reasoning + impact);
  typical judgment calls here: is a divergence a defect or intended behavior, blocked
  cases worth unblocking, discovered cases worth keeping, which existing feature file a
  scenario belongs in.
- **Feedback loop** — "Do you have any additional feedback?" until there is none
  (feedback may target the deliverable **or** the Gherkin files — update both).

Then **stop**. Do not start automation. Next, when the user is ready:
`/auto-qa <feature>` (running it implicitly accepts this specification).
