# Claude Code QA Toolkit v6 — Automation Contract

Conventions the v6 QA commands follow when generating tests. Read together with
the root [`CLAUDE.md`](../CLAUDE.md), which is the single source of truth for the
full architecture (app registry, project generation, layer roles, env) and the
complete run matrix. This file holds only the **QA pipeline** and the
**code-generation delta** — it does not restate what root `CLAUDE.md` covers.

## Pipeline (each phase = one reviewable artifact, per app)

1. `/plan-*` → `docs/qa/<app>/TestPlan.md`
2. `/manual-*` → `docs/qa/<app>/TestCases.md` (+ `Traceability.md`)
3. `/auto-plan-*` → `docs/qa/<app>/AutomationPlan.md`
4. `/auto-*` → code in `apps/<app>/` + `docs/qa/<app>/AutomationReport.md`

`<app>` = the `apps/<name>/` folder under test (or a slug for a new target). The
durable output is the **code** in `apps/<app>/`; the docs are review gates.
`/bootstrap` regenerates this file. For a brand-new target, scaffold first with
`/new-ui-app` or `/new-api-app`, then run the pipeline.

**State / memory.** Every command reads and updates `docs/qa/<app>/ProjectState.md`
via the internal `.claude/agents/workflow-agent.md`: on START it reads the
`CLAUDE.md` conventions + `ProjectState.md` + its input artifact and **validates
phase order** (refusing out-of-order runs, e.g. `/auto-ui` before manual design);
on FINISH it updates the stage, timestamp, and history. `ProjectState.md` is the
durable, per-app carry-forward between phases and sessions — commit it alongside
the artifacts.

## Where `/auto-*` writes (per app)

Stack is Playwright + `playwright-bdd` + TypeScript (see root `CLAUDE.md` for the
layer-roles table and details). Generate into the target app:

- `pom/*.page.ts` — UI Page Objects  ·  `som/*.api.ts` — API Service Objects
- `features/*.feature` — Gherkin  ·  `steps/*.steps.ts` — cross-fixture orchestration
- `specs/e2e|api/*.spec.ts` — spec tests  ·  `specs/fixtures.ts` + `steps/fixtures.ts` — fixtures
- `apps/<app>/.env` (+ `.env.example`) — URLs/secrets  ·  `.features-gen/<app>/` — generated, never edit

## Automation standards (what `/auto-plan-*` and `/auto-*` must follow)

- **Reuse before creating**: existing features, step decorators, POM/SOM, fixtures, hooks, helpers, selectors, and schemas. Never duplicate. Inspect only the relevant `apps/<app>/` files.
- **Dual-style classes**: every POM/SOM exposes a plain helper method **and** a thin `@Given/@When/@Then` decorator over it — no standalone single-fixture step files. Register each new fixture in **both** `specs/fixtures.ts` and `steps/fixtures.ts`.
- **POM three-section layout** (`Assertions` / `Actions` / `BDD step decorators`) — reference `apps/yosemitecinema/pom/auth.page.ts`.
- **Relative navigation** (`page.goto('/')`, `request.get('/path')`); base URL comes from `app.config.ts` / `apps/<app>/.env`; for an API base path (e.g. `/v2`) put the origin in `baseURL` and the prefix on endpoint paths.
- **Locators**: `getByRole` / `getByLabel` / `getByTestId`. Auto-retrying assertions; no hard waits. Every `@Then` uses the verb **"should"**. Tag `@smoke`/`@regression`/`@ui`/`@api` (`@smoke` = the must-pass gate).
- Keep Gherkin business-readable and steps thin (UI behavior in POM, API behavior in SOM).

## Validate

After generating, run `npx tsc --noEmit` and the relevant `npm run test:<app>` /
`npm run test:bdd:<app>` (full run matrix in root `CLAUDE.md`). Report the run
command and a summary of files created/modified.

## Review rule

Do not skip checkpoints. `/auto-*` writes code **only** from the approved
`AutomationPlan.md`.
