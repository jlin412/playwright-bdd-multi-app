# /auto-api

Launch the **Automation (implementation)** phase in **API mode** — writes code.

Input: `artifacts/<feature>/automation.md` Part A (automation design must be `approved`).

1. Resolve `<feature>`.
2. Run the **qa-automation** skill in **API mode**. It runs qa-workflow (requires automation
   design `approved`), implements only approved items into `apps/<feature>/` (SOM dual-style
   + decorators, fixtures in both fixtures files, relative paths with basePath on endpoints)
   following `.claude/project/conventions.md`, carries each `TC-*` ID into the test title,
   reuses existing assets, validates with `npx tsc --noEmit` + `npm run test:<feature>` /
   `test:bdd:<feature>`, and writes `artifacts/<feature>/automation.md` Part B + the
   Traceability ledger (+ updates `automation.yaml`).

Then review: `/review <feature>` → `/approve <feature>`.
