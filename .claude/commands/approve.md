# /approve

Approve a reviewed stage: `in-review` → `approved`, unblocking the next stage.

Input `$ARGUMENTS`: `<feature>` (and optionally a stage — default is the current
`in-review` stage).

Do:
1. In `artifacts/<feature>/<stage>.yaml`: set `status: approved`, `approved_by` (ask or
   infer the reviewer), `approval_date` (today), and `updated`.
2. Append a `history.md` row (`in-review → approved`, with a one-line summary).
3. Report the **next recommended command** (the next stage's command).

Only advances state — never edits artifact content or code.
