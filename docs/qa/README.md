# QA Toolkit (v6)

An artifact-driven QA workflow for this repo, delivered as Claude Code slash
commands. Each phase produces a **reviewable artifact** before the next, so AI
output never jumps straight from requirements to code. The final phase generates
real Playwright + `playwright-bdd` automation in `apps/<app>/`.

Repository conventions the automation commands follow live in
[`.claude/CLAUDE.md`](../../.claude/CLAUDE.md) (filled in for this repo's stack).

## Pipeline

![Agentic QA artifact-driven automation pipeline overview](../images/Agentic_QA_Automation_Pipeline_Overview.png)

| Phase | UI | API | Output (per app) |
|---|---|---|---|
| 1. Planning | `/plan-ui` | `/plan-api` | `docs/qa/<app>/TestPlan.md` |
| 2. Manual design + run | `/manual-ui` | `/manual-api` | `docs/qa/<app>/TestCases.md` + `TestExecution.md` (+ `Traceability.md`) |
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
/manual-ui docs/qa/<app>/TestPlan.md    →  runs cases live → review TestCases.md + TestExecution.md
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

Each command has one job, mirroring a real manual-then-automate QA process:
`/plan-*` decides *what* to test (from supplied context + a passive structure-only
scan + knowledge — no behavioral recon),
`/manual-*` **runs** the cases live and records how they behave (steps, intended vs
actual result, defects), `/auto-plan-*` decides *how automation is implemented*, and
`/auto-*` transcribes the executed cases into tests aligned 1:1 with them (every test
carries its `TC-*` ID; assertions reuse the intended expected value verbatim).

Failed cases are still automated — as `@triage` **reproduction** tests that assert the
intended result (so they fail = an easy replay with a trace). `@triage` is excluded
from both `@smoke` and `@regression`; run it on demand with `npm run test:triage` /
`npm run test:bdd:triage`.
