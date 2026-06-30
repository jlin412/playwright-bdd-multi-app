# QA Toolkit (v6)

An artifact-driven QA workflow for this repo, delivered as Claude Code slash
commands. Each phase produces a **reviewable artifact** before the next, so AI
output never jumps straight from requirements to code. The final phase generates
real Playwright + `playwright-bdd` automation in `apps/<app>/`.

Repository conventions the automation commands follow live in
[`.claude/CLAUDE.md`](../../.claude/CLAUDE.md) (filled in for this repo's stack).

## Pipeline

| Phase | UI | API | Output (per app) |
|---|---|---|---|
| 1. Planning | `/plan-ui` | `/plan-api` | `docs/qa/<app>/TestPlan.md` |
| 2. Manual design | `/manual-ui` | `/manual-api` | `docs/qa/<app>/TestCases.md` (+ `Traceability.md`) |
| 3. Automation planning | `/auto-plan-ui` | `/auto-plan-api` | `docs/qa/<app>/AutomationPlan.md` |
| 4. Automation impl. | `/auto-ui` | `/auto-api` | code in `apps/<app>/` + `docs/qa/<app>/AutomationReport.md` |

Artifacts are written **per app** under `docs/qa/<app>/` (`<app>` = the
`apps/<name>/` folder under test), so multiple apps don't overwrite each other.
`/bootstrap` (re)generates `.claude/CLAUDE.md` — already done for this repo.

Backed by subagents (`.claude/agents/`) and templates (`.claude/templates/`).

## State & sequencing (`ProjectState.md`)

Each app's pipeline position is tracked in `docs/qa/<app>/ProjectState.md`. Every
command runs the internal `.claude/agents/workflow-agent.md`, which on **start**
reads the `CLAUDE.md` conventions + `ProjectState.md` + the required input
artifact and **validates phase order** (it refuses out-of-order runs — e.g.
`/auto-ui` before `/manual-ui` — and tells you which command to run first), and on
**finish** updates the stage, timestamp, and history.

Stages: `not-started → planned → manual-designed → automation-planned → automated`.
This file is the durable carry-forward between phases and sessions — commit it
with the artifacts so any session sees exactly where each app stands.

## Recommended workflow (review at every arrow)

```text
/plan-ui  <url|story|app>        →  review docs/qa/<app>/TestPlan.md
/manual-ui docs/qa/<app>/TestPlan.md    →  review TestCases.md
/auto-plan-ui docs/qa/<app>/TestCases.md →  review AutomationPlan.md
/auto-ui  docs/qa/<app>/AutomationPlan.md →  review the code + AutomationReport.md
```

API is identical with the `*-api` commands and a Swagger/OpenAPI input to `/plan-api`.

## Brand-new app under test

The pipeline assumes the app already exists. Scaffold it first, then run the
pipeline to fill in tests:

```text
/new-ui-app  shop https://www.saucedemo.com [user] [pass]
/new-api-app billing https://api.example.com/openapi.json
```

## Design principle

Each command has one job: `/plan-*` decides *what* to test, `/manual-*` explains
*how* to test it manually, `/auto-plan-*` decides *how automation is implemented*,
and `/auto-*` writes code from the **approved** plan only.
