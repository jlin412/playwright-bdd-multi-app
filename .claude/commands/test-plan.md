# /test-plan

Run the **Test Plan specialist** — determine WHAT needs to be tested — then own the
complete review of the result. Stage 1 of 4 (`/test-plan` → `/manual-qa` → `/auto-qa`
→ `/testops`).

Input `$ARGUMENTS`: a target (URL / Swagger spec / story / feature slug) plus any
supplied context (requirements, an existing plan or cases, a feature list, a role &
rights matrix, screenshots, files).

## Step 1 — Generate

1. Resolve `<feature>` (an `apps/<name>/` folder name, or a slug for a new target).
   This is the entry stage — no prior deliverable required. If
   `deliverables/<feature>/01-Test-Plan.md` already exists, **update** it (append to its
   Review History) rather than starting over.
2. Run the **qa-test-plan** skill (delegable to the `qa-test-plan` subagent). It infers
   the mode (UI / API / both), reads the mode's coverage checklists, and writes
   `deliverables/<feature>/01-Test-Plan.md` from the `01-test-plan.md` template.

## Steps 2–6 — Review (the `qa-review` skill, in the main conversation)

- **Open** the deliverable automatically (`code` + a clickable link).
- **Executive Summary** in chat: scenario count, top risks, coverage areas, priorities,
  open questions.
- **Review Checklist** from `.claude/checklists/review-test-plan.md`, each item ✓/✗.
- **Interactive review** — one question per turn (recommendation + reasoning + impact);
  typical judgment calls here: risk ratings, scope boundaries, priority calls,
  assumed-feature confirmation, open questions needing a product answer.
- **Feedback loop** — "Do you have any additional feedback?" until there is none.

Then **stop**. Do not start manual testing. Next, when the user is ready:
`/manual-qa <feature>` (running it implicitly accepts this plan).
