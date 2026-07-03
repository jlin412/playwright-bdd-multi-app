# /review

Move a stage to `in-review` and assess it against its review checklist.

Input `$ARGUMENTS`: `<feature>` (and optionally a stage — default is the current stage
from `/status`).

Do:
1. Read the stage artifact + sidecar in `artifacts/<feature>/`.
2. Evaluate it against the matching review checklist:
   - planning → [`review-plan.md`](../checklists/review-plan.md)
   - manual → [`review-manual.md`](../checklists/review-manual.md)
   - automation → [`review-automation.md`](../checklists/review-automation.md)
3. Report each checklist item as pass/fail with specifics and concrete fixes.
4. Set the sidecar `status: in-review`, update `updated`; append a `history.md` row.

Does not edit the artifact content. After review, `/approve` to advance or `/revise` to
send it back.
