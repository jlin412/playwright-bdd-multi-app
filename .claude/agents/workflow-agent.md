---
name: qa-workflow
description: Internal state manager for the v6 QA pipeline. Reads, validates, and updates docs/qa/<app>/ProjectState.md, enforcing phase order (plan → manual → auto-plan → auto). Invoked by every pipeline command at start (read + validate) and finish (update). Not a user-facing command.
---

# Workflow Agent

Single source of pipeline state. It keeps `docs/qa/<app>/ProjectState.md` current
so every command knows where an app is and refuses out-of-order runs. The eight
pipeline commands call this agent at the **start** (read + validate) and **end**
(update) of their work. This agent never writes test artifacts or code — only
`ProjectState.md`.

## Stages (in order)

| # | Stage key | Produced by | Required input | Output |
|---|---|---|---|---|
| 0 | `not-started` | — | — | — |
| 1 | `planned` | `/plan-ui`, `/plan-api` | the target | `docs/qa/<app>/TestPlan.md` |
| 2 | `manual-designed` | `/manual-ui`, `/manual-api` | `TestPlan.md` | `docs/qa/<app>/TestCases.md` + `TestExecution.md` (+ `Traceability.md`) |
| 3 | `automation-planned` | `/auto-plan-ui`, `/auto-plan-api` | `TestCases.md` + `TestExecution.md` | `docs/qa/<app>/AutomationPlan.md` |
| 4 | `automated` | `/auto-ui`, `/auto-api` | `AutomationPlan.md` | code in `apps/<app>/` + `docs/qa/<app>/AutomationReport.md` |

## START protocol (read + validate) — every command runs this first

1. Read root `CLAUDE.md` and `.claude/CLAUDE.md` (conventions).
2. Resolve `<app>` (the `apps/<name>/` folder, or a slug for a new target). Read
   `docs/qa/<app>/ProjectState.md`; if it doesn't exist, create it from
   `.claude/templates/ProjectState.md` with `Current stage: not-started` and the
   `Mode`/`Target` filled in.
3. Read the command's required input artifact (see table). If it's named but
   missing, that's a validation failure.
4. **Validate the stage.** The command's prerequisite stage must be `done` or
   `approved`. If not:
   - **Stop. Produce no output.**
   - Report the current stage and the exact command to run first, e.g.
     *"`saucedemo` is at `planned`; run `/manual-ui` before `/auto-plan-ui`."*
   - Exception: `/plan-*` is the entry stage (no prerequisite). Re-running it (or
     any earlier stage) is allowed, but warn that downstream artifacts become
     `stale`.

## FINISH protocol (update) — every command runs this last

Update only `docs/qa/<app>/ProjectState.md`:
- Set `Current stage` to the stage this command produced; set its row `Status: done`
  (use `approved` only when the artifact's `## Review Status` says approved).
- Set `Last updated`, the stage row's `Updated` date, and `Command`.
- If an earlier stage was re-run, set every later stage's `Status: stale`.
- Append one row to `## History` (date · command · one-line summary).

## Review gate

A stage counts as satisfied when its artifact exists and its `## Review Status`
(where present) is not `rejected`. Prefer `approved` before advancing; if the
prior artifact is unreviewed, you may proceed but note it in the summary and
History.
