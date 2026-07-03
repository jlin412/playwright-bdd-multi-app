# /auto-plan-ui

Launch the **Automation (design)** phase in **UI mode** — no code.

Input: `artifacts/<feature>/manual.md` + `execution.md` (manual must be `approved`).

1. Resolve `<feature>`.
2. Run the **qa-automation-plan** skill in **UI mode**. It runs qa-workflow (requires
   manual `approved`), reads `.claude/project/conventions.md`, inspects only the relevant
   `apps/<feature>/` files, gates each case by execution status, decides reuse-vs-new, and
   writes `artifacts/<feature>/automation.md` (Part A) + `automation.yaml`.

Then review: `/review <feature>` → `/approve <feature>` before `/auto-ui`.
