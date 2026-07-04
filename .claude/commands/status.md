# /status

Show where each feature is in the v4 workflow — read purely from `deliverables/`, never
from chat. Read-only; never modifies anything.

Input `$ARGUMENTS`: an optional `<feature>`. If omitted, report every folder under
`deliverables/`.

The workflow is strictly sequential — there is no state file. A stage is **done** when
its deliverable exists; the **next command** is the first missing one:

| Deliverable | Produced by |
|---|---|
| `01-Test-Plan.md` | `/test-plan` |
| `02-Manual-QA.md` | `/manual-qa` |
| `03-Automation-QA.md` | `/auto-qa` |
| `04-TestOps.md` | `/testops` |

Do:
1. For `<feature>`, list which of the four deliverables exist (with last-modified dates)
   and each one's Executive Summary line if present.
2. Report the **next command** (first missing deliverable; after `04-TestOps.md`, the
   cycle is complete) and any open items visible in the latest Review History.
3. With no `<feature>`, print a table: feature → latest deliverable → next command.

Legacy note: pre-v4 features may have `artifacts/<feature>/` folders (the v3 layout).
List them under a "legacy (v3)" heading and suggest `/test-plan <feature>` to bring the
feature into v4.
