# Artifacts — the durable source of truth

Every workflow stage writes here, **outside `.claude/`**, so its output can be reviewed,
edited, approved, versioned, committed, and resumed later. **Chat history is never
required to continue work** — these files are the record.

One folder per QA work unit (`<feature>` = an app like `petstore`, or a feature slug):

```
artifacts/<feature>/
  plan.md         plan.yaml          # Planning        (qa-planning · /plan-*)
  manual.md       manual.yaml        # Manual Testing  (qa-manual-design · /manual-*)
  execution.md                       # Execution log   (manual + automated runs)
  automation.md   automation.yaml    # Automation      (qa-automation-plan + qa-automation)
  bugs.md                            # Failure Analysis (qa-triage; defect register)
  history.md                         # Continuous Improvement (transition log + notes)
```

Stage skeletons live in [`.claude/templates/`](../.claude/templates/); the workflow that
sequences them is [`.claude/workflow/`](../.claude/workflow/). Automation **code** is not
here — it lands in `apps/<app>/` per Project Memory conventions.

## Metadata (the `.yaml` sidecars)

Gated stages (`plan`, `manual`, `automation`) each carry a YAML sidecar that makes the
stage machine-readable and drives workflow state:

| Field | Meaning |
|---|---|
| `stage` | which lifecycle stage this is |
| `status` | `draft` · `in-review` · `approved` · `rejected` · `blocked` · `stale` |
| `owner` | who holds the stage |
| `created` / `updated` | dates |
| `version` | bumped on each `/revise` |
| `depends_on` | upstream stage(s) that must be `approved` first |
| `next_stage` | the stage this unblocks |
| `approved_by` / `approval_date` | set by `/approve` |

`execution.md`, `bugs.md`, and `history.md` are **append-only logs** (no approval gate,
no sidecar).

## State is derived, not stored separately

Workflow state (current stage, completed, pending review, blocked, next command) is
computed from the sidecars — see
[`.claude/workflow/pipeline.md`](../.claude/workflow/pipeline.md#workflow-state-derived-never-chat).
Read it with `/status`; advance it with `/review`, `/approve`, `/revise`; inspect the log
with `/history`.
