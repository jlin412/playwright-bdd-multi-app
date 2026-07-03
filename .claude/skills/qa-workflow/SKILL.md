---
name: qa-workflow
description: State protocol for the QA pipeline. Reads, validates, and updates docs/qa/<app>/ProjectState.md and enforces phase order (plan → manual → auto-plan → auto). Invoked at the START and FINISH of every pipeline phase. Not user-facing.
---

# QA Workflow — state protocol

Single source of pipeline state. Keeps `docs/qa/<app>/ProjectState.md` current so any
session knows where an app stands and out-of-order runs are refused. Every phase skill
calls this at **START** (read + validate) and **FINISH** (update). It never writes test
artifacts or code — only `ProjectState.md`.

## Stages (in order)

| # | Stage key | Produced by (skill / command) | Required input | Output |
|---|---|---|---|---|
| 0 | `not-started` | — | — | — |
| 1 | `planned` | qa-planning · `/plan-*` | the target | `docs/qa/<app>/TestPlan.md` |
| 2 | `manual-designed` | qa-manual-design · `/manual-*` | `TestPlan.md` | `TestCases.md` + `TestExecution.md` (+ `Traceability.md`) |
| 3 | `automation-planned` | qa-automation-plan · `/auto-plan-*` | `TestCases.md` + `TestExecution.md` | `AutomationPlan.md` |
| 4 | `automated` | qa-automation · `/auto-*` | `AutomationPlan.md` | code in `apps/<app>/` + `AutomationReport.md` |

> Execution and analysis stages join this table when the Artifacts/State layer lands.

## START protocol — every phase runs this first

1. Read repo memory: `.claude/project/conventions.md` + `.claude/project/stack.md`.
2. Resolve `<app>`. Read `docs/qa/<app>/ProjectState.md`; if missing, create it from
   `.claude/templates/ProjectState.md` (`Current stage: not-started`, `Mode`/`Target` set).
3. Read the phase's required input artifact (see table). Named-but-missing = validation failure.
4. **Validate the stage.** The prerequisite stage must be `done` or `approved`. If not:
   - **Stop. Produce no output.**
   - Report the current stage and the exact command to run first
     (e.g. *"`saucedemo` is at `planned`; run `/manual-ui` before `/auto-plan-ui`."*).
   - Exception: planning is the entry stage. Re-running an earlier stage is allowed but
     warn that downstream artifacts become `stale`.

## FINISH protocol — every phase runs this last

Update only `ProjectState.md`:
- Set `Current stage` to what this phase produced; set its row `Status: done`
  (use `approved` only when the artifact's `## Review Status` says approved).
- Set `Last updated`, the row's `Updated`, and `Command`.
- If an earlier stage was re-run, set every later stage `Status: stale`.
- Append one `## History` row (date · command · one-line summary).

## Review gate

A stage is satisfied when its artifact exists and its `## Review Status` (where present)
is not `rejected`. Prefer `approved` before advancing; if the prior artifact is
unreviewed you may proceed, but note it in the summary and History.
