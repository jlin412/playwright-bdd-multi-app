# /status

Show workflow state for a feature (or all features) — read purely from artifacts, never
from chat.

Input `$ARGUMENTS`: an optional `<feature>`. If omitted, list every folder under
`artifacts/` with its current stage.

Do:
1. For `<feature>`, read `artifacts/<feature>/*.yaml` and `history.md`.
2. Apply the derivation rules in
   [`.claude/workflow/pipeline.md`](../workflow/pipeline.md#workflow-state-derived-never-chat)
   and report:
   - **Current stage** · **Completed** · **Pending review** · **Blocked**
   - **Approval status** per stage (`approved_by` / `approval_date`)
   - **Next recommended command**
3. With no `<feature>`, print a table: feature → current stage → next command.

Read-only. Never modifies artifacts.
