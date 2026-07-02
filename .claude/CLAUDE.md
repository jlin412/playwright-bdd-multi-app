# Claude Code QA Toolkit v6 — Automation Contract

Conventions the v6 QA commands follow when generating tests. Read together with
the root [`CLAUDE.md`](../CLAUDE.md), which is the single source of truth for the
full architecture (app registry, project generation, layer roles, env) and the
complete run matrix. This file holds only the **QA pipeline** and the
**code-generation delta** — it does not restate what root `CLAUDE.md` covers.

## Pipeline (each phase = one reviewable artifact, per app)

1. `/plan-*` → `docs/qa/<app>/TestPlan.md`
2. `/manual-*` → `docs/qa/<app>/TestCases.md` + `TestExecution.md` (+ `Traceability.md`)
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

## Recon, execution & alignment model

The pipeline mirrors a real manual-then-automate QA process:

- **Plan is design-first, structure-only** — `/plan-*` builds the case inventory from,
  in priority order: **supplied context** (requirements, test plan/cases, feature list,
  functionality description, role & rights matrix, screenshots, files), a **passive
  read-only scan** of the target (UI: render the landing page once + read nav/sitemap,
  Playwright MCP for SPAs; API: read the Swagger/OpenAPI), and **testing-knowledge
  archetypes**. It discovers *what features exist* (structure) but does **no behavioral
  recon or execution** — no flows, auth, state changes, or case runs (those are
  `/manual-*`). Scan/archetype-derived features are marked **assumed** for manual to
  confirm. Plan assigns each case a stable `TC-<AREA><NN>` ID that threads through every
  later artifact.
- **Manual does the live recon + execution** — `/manual-*` explores and runs each case
  against the real app (Playwright MCP for UI; real HTTP for API), bounded to **safe,
  reachable** cases (including safe negatives like invalid login, whose exact error
  text is only knowable by triggering it). It records two values per case — the
  **intended** expected result (design) and the **actual** observed result (run) — and
  a status: `pass` · `fail` · `blocked` · `not-run`. Reusable cases go in
  `TestCases.md`; the dated run log + defects go in `TestExecution.md`.
- **Automation is transcription, aligned 1:1** — `/auto-plan-*` and `/auto-*` consume
  only executed cases and reuse the **intended** expected values verbatim as
  assertions. Every automated test carries its `TC-*` ID (no orphans); every
  `pass`/`fail` case is covered or listed as a documented gap in `Traceability.md`.

### `@triage` (failed cases)

A case with status `fail` is a defect. It is **still automated** — as a
**reproduction** test that asserts the *intended* result (so it currently fails,
giving a one-command replay with a Playwright trace) — and tagged `@triage`. `@triage`
tests are **excluded from both `@smoke` and `@regression`** and run only on demand:
`npm run test:triage` (spec) / `npm run test:bdd:triage` (BDD). They wait for reviewer
sign-off; full defect triage is a separate, future workflow. Never assert the buggy
observed behavior, and never also tag a `@triage` test `@smoke`/`@regression`.
`blocked`/`not-run` cases are **not** automated — they are documented coverage gaps.

## Where `/auto-*` writes (per app)

Stack is Playwright + `playwright-bdd` + TypeScript (see root `CLAUDE.md` for the
layer-roles table and details). Generate into the target app:

- `pom/*.page.ts` — UI Page Objects  ·  `som/*.api.ts` — API Service Objects
- `features/*.feature` — Gherkin  ·  `steps/*.steps.ts` — cross-fixture orchestration
- `specs/e2e|api/*.spec.ts` — spec tests  ·  `specs/fixtures.ts` + `steps/fixtures.ts` — fixtures
- `apps/<app>/.env` (+ `.env.example`) — URLs/secrets  ·  `.features-gen/<app>/` — generated, never edit

## Automation standards (what `/auto-plan-*` and `/auto-*` must follow)

- **Reuse before creating**: existing features, step decorators, POM/SOM, fixtures, hooks, helpers, selectors, and schemas. Never duplicate. Inspect only the relevant `apps/<app>/` files.
- **Align to `TC-*`, transcribe don't invent**: automate only executed manual cases; every test carries its `TC-*` ID (no orphans) and asserts the **intended** expected value from `TestCases.md` verbatim. `pass` → normal test; `fail` → `@triage` repro asserting the intended result; `blocked`/`not-run` → documented gap.
- **Dual-style classes**: every POM/SOM exposes a plain helper method **and** a thin `@Given/@When/@Then` decorator over it — no standalone single-fixture step files. Register each new fixture in **both** `specs/fixtures.ts` and `steps/fixtures.ts`.
- **POM three-section layout** (`Assertions` / `Actions` / `BDD step decorators`) — reference `apps/yosemitecinema/pom/auth.page.ts`.
- **Relative navigation** (`page.goto('/')`, `request.get('/path')`); base URL comes from `app.config.ts` / `apps/<app>/.env`; for an API base path (e.g. `/v2`) put the origin in `baseURL` and the prefix on endpoint paths.
- **Locators**: `getByRole` / `getByLabel` / `getByTestId`. Auto-retrying assertions; no hard waits. Every `@Then` uses the verb **"should"**. Tag `@smoke`/`@regression`/`@ui`/`@api` (`@smoke` = the must-pass gate); `@triage` marks a failed-case repro — out of smoke/regression, run via `test:triage` / `test:bdd:triage`.
- Keep Gherkin business-readable and steps thin (UI behavior in POM, API behavior in SOM).

## Validate

After generating, run `npx tsc --noEmit` and the relevant `npm run test:<app>` /
`npm run test:bdd:<app>` (full run matrix in root `CLAUDE.md`). Report the run
command and a summary of files created/modified.

## Review rule

Do not skip checkpoints. `/auto-*` writes code **only** from the approved
`AutomationPlan.md`.

## QA Knowledge Library

Before running any QA workflow command, read the relevant knowledge files.

UI commands:
- `.claude/knowledges/ui-testing.md`
- `.claude/knowledges/security-testing.md`
- `.claude/knowledges/accessibility-testing.md`
- `.claude/knowledges/performance-testing.md`

API commands:
- `.claude/knowledges/api-testing.md`
- `.claude/knowledges/security-testing.md`
- `.claude/knowledges/performance-testing.md`

Mobile commands:
- `.claude/knowledges/mobile-testing.md`
- `.claude/knowledges/security-testing.md`
- `.claude/knowledges/accessibility-testing.md`
- `.claude/knowledges/performance-testing.md`

IoT commands:
- `.claude/knowledges/iot-testing.md`
- `.claude/knowledges/api-testing.md`
- `.claude/knowledges/security-testing.md`
- `.claude/knowledges/performance-testing.md`

Use these files as checklists for planning, manual test generation, automation planning, and coverage gap analysis.
