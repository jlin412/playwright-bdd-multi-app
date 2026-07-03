---
name: qa-workflow
description: State protocol for the QA pipeline. Derives and updates workflow state from the per-stage YAML sidecars in artifacts/<feature>/ and enforces phase order. Invoked at the START and FINISH of every pipeline phase. Not user-facing.
---

# QA Workflow — state protocol

Owns pipeline state. State is **derived** from the per-stage YAML sidecars
(`plan.yaml`, `manual.yaml`, `automation.yaml`) in `artifacts/<feature>/` — there is no
separate state file to drift. Every phase skill calls this at **START** (read + validate)
and **FINISH** (update). It writes only the sidecars + `history.md` — never test
artifacts or code. Stage graph: [`.claude/workflow/pipeline.yaml`](../../workflow/pipeline.yaml).

## Stages (in order)

| # | Stage | Skill · command | Input | Artifacts |
|---|---|---|---|---|
| 1 | `planning` | qa-planning · `/plan-*` | the target | `plan.md` + `plan.yaml` |
| 2 | `manual` | qa-manual-design · `/manual-*` | `plan.*` | `manual.md` + `manual.yaml` + `execution.md` |
| 3 | `automation` | qa-automation-plan (`/auto-plan-*`) → qa-automation (`/auto-*`) | `manual.*` | `automation.md` + `automation.yaml` + code |
| — | execution · analysis · improvement | npm scripts · qa-triage | — | `execution.md` · `bugs.md` · `history.md` |

## START protocol — every phase runs this first

1. Read repo memory: `.claude/project/conventions.md` + `.claude/project/stack.md`.
2. Resolve `<feature>`. Read `artifacts/<feature>/*.yaml`. If the folder is missing, create
   it and seed this stage's artifacts from `.claude/templates/` (`status: draft`; set
   `mode`/`target` on `plan.yaml`).
3. Read the phase's required input artifact. Named-but-missing = validation failure.
4. **Validate order**: the prerequisite stage's `status` must be `approved`. If not:
   - **Stop. Produce no output.**
   - Report the current stage + the exact command to run first
     (e.g. *"`saucedemo` planning is `in-review`; run `/approve` before `/manual-ui`."*).
   - Exception: `planning` is the entry stage (no prerequisite).

## FINISH protocol — every phase runs this last

- Set this stage's sidecar: `status: draft` (generation does **not** self-approve — a human
  advances it via `/review` → `/approve`), and update `updated`, `version`, plus the
  `run`/`validation` fields where applicable.
- Append a row to `history.md` (date · stage · command · from→to · one-line summary).
- If an earlier stage was re-run, set every later stage's `status: stale`.

## Derived state (surfaced by `/status`)

- **Current stage** — earliest gated stage whose `status` ≠ `approved` (respect `depends_on`).
- **Completed** — `approved`. **Pending review** — `in-review`. **Blocked** — `blocked`.
- **Next command** — the command that produces the current stage, or "review & `/approve`"
  when it is `in-review`. Full rules: [`.claude/workflow/pipeline.md`](../../workflow/pipeline.md).

## Review gate

Advance only past `approved` (set by `/approve`). `draft`/`in-review` are not advanceable;
`rejected` returns to `draft` via `/revise` (which bumps `version`).
