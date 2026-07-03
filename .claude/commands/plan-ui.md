# /plan-ui

Launch the **Planning** phase in **UI mode**.

Input `$ARGUMENTS`: a target (URL / story / feature slug) plus any supplied context
(requirements, an existing plan/cases, a feature list, a role & rights matrix,
screenshots, files).

1. Resolve `<feature>` (an `apps/<name>/` folder name, or a slug for a new target).
2. Run the **qa-planning** skill in **UI mode**. It runs the qa-workflow START/FINISH
   protocol, reads the UI checklists (`core-ui`, `security`, `accessibility`,
   `performance`), and writes `artifacts/<feature>/plan.md` + `plan.yaml`.

Then review: `/review <feature>` → `/approve <feature>` before `/manual-ui`.
