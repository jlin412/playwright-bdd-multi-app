# /revise

Send a stage back for changes: `in-review` | `rejected` → `draft`, bumping `version`.

Input `$ARGUMENTS`: `<feature>` [stage] plus optional revision notes.

Do:
1. In `artifacts/<feature>/<stage>.yaml`: set `status: draft`, bump `version`, update `updated`.
2. Record the requested changes in `history.md` (and, if brief, in the artifact's Review Notes).
3. Point the user at the command that regenerates that stage (e.g. `/plan-ui`,
   `/manual-api`) or suggest a hand-edit.

Does not rewrite the artifact itself — re-run the stage command or edit by hand, then
`/review` again.
