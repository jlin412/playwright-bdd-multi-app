# /auto-ui

Launch the **Automation (implementation)** phase in **UI mode** — writes code.

Input: `artifacts/<feature>/automation.md` Part A (automation design must be `approved`).

1. Resolve `<feature>`.
2. Run the **qa-automation** skill in **UI mode**. It runs qa-workflow (requires automation
   design `approved`), implements only approved items into `apps/<feature>/` following
   `.claude/project/conventions.md`, carries each `TC-*` ID into the test title, reuses
   existing assets, validates with `npx tsc --noEmit` + `npm run test:<feature>` /
   `test:bdd:<feature>`, and writes `artifacts/<feature>/automation.md` Part B + the
   Traceability ledger (+ updates `automation.yaml`).

Then review: `/review <feature>` → `/approve <feature>`. Run the suite with `/status`'s
suggested commands or `npm run test:<feature>`.
