# /investigate

Run the **Bug Investigator** — root-cause one open defect and draft its bug report —
then own the complete review of the result. On-demand utility, **not** a workflow
stage: run it any time after `/manual-qa` has recorded a defect.

Input `$ARGUMENTS`: `<feature> [defect # | TC-id]`.

## Step 1 — Generate

1. Resolve `<feature>`. **Precondition**: `deliverables/<feature>/02-Manual-QA.md`
   must exist with at least one `open` row in § Possible Defects. If it's missing,
   stop and point the user at `/manual-qa`.
2. Select the defect: the argument names it (defect # or TC-id); with exactly one
   open defect, take it; with several and no argument, list them and ask.
3. Run the **qa-investigate** skill (delegable to the `investigate-agent` subagent).
   It replays the `@triage` repro for fresh evidence, delivers a root-cause verdict
   (product vs test vs environment), drafts the developer-ready bug report, and
   states the fix-verification contract. Appends to
   `deliverables/<feature>/05-Investigations.md` and updates the defect's row in
   `02-Manual-QA.md § Possible Defects`.

## Steps 2–6 — Review (the `qa-review` skill, in the main conversation)

- **Open** the deliverable automatically (`code` + a clickable link).
- **Executive Summary** in chat: the defect, root-cause verdict, severity, the
  fix-verification contract.
- **Review Checklist** from `.claude/checklists/review-investigation.md`, each item ✓/✗.
- **Interactive review** — one question per turn (recommendation + reasoning + impact);
  typical judgment calls here: the root-cause verdict, the severity rating, a
  `wont-fix` / `cannot-reproduce` disposition, whether the report is ready to hand
  to a developer.
- **Feedback loop** — "Do you have any additional feedback?" until there is none.

Then **stop**. When the defect's fix lands, the `@triage` repro passes — retag it and
close the defect per the `qa-triage` skill's retag rule.
