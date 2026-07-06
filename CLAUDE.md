# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **multi-app** Playwright + `playwright-bdd` template. Each app under test lives
in `apps/<name>/` and is driven from one POM/SOM class layer: **UI** apps run in
two styles (spec + BDD), while **API** coverage is **spec-only** (no feature files).
Bundled apps: `saucedemo` (UI), `petstore` (API). See `README.md` for the
user-facing overview.

## Commands

```bash
npm install
npx playwright install                 # all browsers (chromium/firefox/webkit)

# Spec style
npm test                               # smoke, all apps
npm run test:api                       # all API spec tests (path filter: specs/api)
npm run test:ui                        # all UI spec tests, smoke (path filter: specs/e2e)
npm run test:regression                # UI specs incl. specs/e2e/workflows/**

# BDD style — UI only (generates .features-gen/<app>/ first, then runs Playwright)
npm run test:bdd                       # smoke, all UI apps
npm run test:bdd:ui                    # @ui scenarios
npm run test:bdd:regression            # includes @regression

# Scope to one app (per-app shortcuts; the /new-*-app commands generate these)
npm run test:<app>                     # spec smoke for one app
npm run test:bdd:<app>                 # BDD for one UI app (via scripts/bdd.mjs)

# Filter BDD by feature / tag expression (args after --)
npm run test:bdd:saucedemo -- --feature login
npm run test:bdd:saucedemo -- --tags "@smoke and @ui"
npm run bdd -- --tags "@ui and not @regression"   # all apps

# Or use raw Playwright filters
npx playwright test apps/saucedemo
npx playwright test --project=api-petstore
npx playwright test -c playwright.bdd.config.ts --project=bdd-ui-saucedemo-webkit

# Scaffold a new app under test (Claude Code slash commands)
/new-api-app <name> <swaggerUrl|baseUrl>       # API app — SOM generated from the spec
/new-ui-app  <name> <baseUrl> [user] [pass]    # UI app — home + login POM
# engine (also runs `both`): node scripts/new-app.mjs <name> --kind ui|api|both --url <baseURL> [--swagger <url>] --yes

# Interactive / debug
npm run debug:ui                       # Playwright Test UI (spec style)
npm run debug:bdd:ui                   # Playwright Test UI (BDD style, runs bddgen first)

# Type-check (CI gate)
npx tsc --noEmit

# Reports
npm run report                         # Playwright HTML
npm run report:bdd:html                # Cucumber HTML
```

## Architecture

### App registry drives everything

`config/apps.ts` aggregates each `apps/<name>/app.config.ts` (an `AppDescriptor`
from `lib/app-config.ts`: `{ name, baseURL, ui?, api? }`). Both Playwright configs
map over the registry to **generate projects** — adding an app needs no config edits
beyond registering it:

- `playwright.config.ts` (spec) → `api-<name>` and `ui-<name>-<browser>` projects, routed by `testMatch` on `apps/<name>/specs/{api,e2e}/`.
- `playwright.bdd.config.ts` (BDD) → **one `defineBddConfig` per UI app** (output `.features-gen/<name>/`, app-scoped `steps` glob) → `bdd-ui-<name>-<browser>` projects.

Per-app `defineBddConfig` is what lets each app keep its own `steps/fixtures.ts`:
each config's `steps` glob sees exactly one `test` instance + one decorated class set.

Routing rule: **BDD is UI-only** — only apps with `ui` get BDD (`bdd-ui-<name>-<browser>`)
projects. API coverage is **spec-only** (`api-<name>` projects); a pure-`api` app has no
BDD project. Its SOM keeps `@Given/@When/@Then` decorators (the `som/**` steps glob stays)
so the service object can still back UI BDD steps when an app has both UI and API.

### URLs are decoupled from projects

Page/Service objects navigate with **relative** paths (`page.goto('/')`,
`request.get('/path')`). Each app's `baseURL` flows into its generated projects'
`use.baseURL`. Projects encode only browser/style — never the target URL. If an API
has a base path (e.g. PetStore's `/v2`), put the origin in `baseURL` and the prefix
on the endpoint paths, because a leading-slash path resolves against the origin.

### Two parallel test styles, one shared class layer

Every POM/SOM class is annotated with both Playwright fixture types and
`playwright-bdd` decorators, so the same class drives both styles:

- **Spec tests** import from `apps/<name>/specs/fixtures.ts` (extends `@playwright/test`'s `base`).
- **BDD tests** import from `apps/<name>/steps/fixtures.ts` (extends `playwright-bdd`'s `base`); step definitions come from `@Given`/`@When`/`@Then` decorators on the POM/SOM methods.

Both fixtures files instantiate the same classes; adding a class means updating both.

### Layer roles (within an app)

| Layer | Location | Purpose |
|---|---|---|
| POM | `apps/<name>/pom/*.page.ts` | UI interactions; `goto()`, `expectXxx()`, named locators |
| SOM | `apps/<name>/som/*.api.ts` | HTTP checks via `APIRequestContext` |
| BDD features | `apps/<name>/features/*.feature` | Gherkin (**UI only**) tagged `@smoke`/`@regression`/`@ui`/`@fail` |
| BDD steps | `apps/<name>/steps/fixtures.ts`, `hooks.ts` | fixture wiring + Before/After; step impls live on POM/SOM |
| Workflow specs | `apps/<name>/specs/e2e/workflows/` | multi-step flows, excluded from smoke via `SMOKE_ONLY=1` |

`bddgen` compiles `.feature` files into `.features-gen/<name>/` — generated, never
edit by hand. The `test:bdd*` scripts run it automatically.

### Env / config

- **Per-app env**: each app has `apps/<name>/.env` (gitignored) + `apps/<name>/.env.example` (committed). `lib/load-env.ts` (imported by both configs *before* `config/apps`) loads root `.env` then every `apps/<name>/.env`; real/CI env wins (`override: false`). Keys are app-unique/prefixed (one shared process) — e.g. `SAUCEDEMO_BASE_URL`+`SAUCE_USERNAME`/`SAUCE_PASSWORD`, `PETSTORE_BASE_URL`.
- `<NAME>_BASE_URL` overrides an app's base URL; read by `apps/<name>/app.config.ts`.
- `SMOKE_ONLY=1` excludes `specs/e2e/workflows/**` + `trace-fail` specs, and `@fail`/`@tracefail` BDD scenarios.
- CI sets `forbidOnly`, `retries: 1`; BDD caps workers at 2. In CI, pass secrets as workflow env vars (they override the absent per-app `.env`).

### Supporting directories

- `bdd/cucumber-reporter.cjs` — custom Cucumber HTML reporter wired into `playwright.bdd.config.ts`; outputs to `cucumber-report/`.
- `mcp/playwright-mcp-server.mjs` — MCP server for AI-assisted test authoring (see `.vscode/mcp.json`). Exposes tools to list/generate test files from a page path.
- `apps/<name>/recon/` — one-off exploration scripts used to discover real selectors and app flows before writing POMs (AI authoring loop). Not part of the test suite; run directly with `node`.

## Adding an app

Use the Claude Code slash commands — `/new-api-app <name> <swaggerUrl|baseUrl>`
or `/new-ui-app <name> <baseUrl> [user] [pass]` (see `.claude/commands/`). They
drive the engine `scripts/new-app.mjs`, which copies `apps/_template`, fills
`app.config.ts`, prunes the unused dimension, writes kind-appropriate
fixtures/feature, writes `apps/<name>/.env` + `.env.example`, registers the app
in `config/apps.ts`, and adds `test:<name>` / `test:bdd:<name>` scripts. Run the
engine directly for a combined app: `node scripts/new-app.mjs <name> --kind both …`.
`apps/_template` is excluded from runs (`testIgnore`) but must still type-check.

## QA Toolkit v5 (Claude Code commands)

An AI-native QA toolkit ships as slash commands: four sequential specialist agents in a
strictly sequential, review-driven workflow, plus an on-demand Bug Investigator. Each
stage writes a durable deliverable under `deliverables/<feature>/`; automation code
lands in `apps/<app>/`. Overview + migration guide: `README.md` § "QA Toolkit v5".
Layers:

- **Commands** (`.claude/commands/`) — thin launchers; each workflow command generates,
  then owns the complete interactive review of its deliverable.
- **Skills** (`.claude/skills/`) — reusable QA methodology (`qa-test-plan`, `qa-manual`,
  `qa-automation`, `qa-testops`, `qa-investigate`, plus shared `qa-review` +
  `qa-triage`); the five specialists have paired subagents in `.claude/agents/`.
- **Checklists** (`.claude/checklists/`) — single-source coverage + review checklists.
- **Templates** (`.claude/templates/`) — deliverable skeletons (`01`–`05`).
- **Project Memory** (`.claude/project/`) — this repo's conventions + stack + review
  calibration (learned reviewer preferences).
- **Deliverables** (`deliverables/<feature>/`) — the durable source of truth
  (`artifacts/` is the read-only v3 archive).

Workflow: `/test-plan` → `/manual-qa` → `/auto-qa` → `/testops`. There is no approval
command and no state machine — running the next command implicitly accepts the previous
stage, and each command finishes with an interactive review (one question at a time,
then a feedback loop) recorded in the deliverable's Review History. On demand:
`/investigate <feature>` root-causes an open defect (`05-Investigations.md`);
`/testops repo` assesses the whole repo with trends from the append-only
`deliverables/_repo/ledger.md` (every `/testops` run appends to it); a PR-triggered
GitHub Action (`.github/workflows/testops.yml`) posts the release-readiness verdict as
a sticky comment; `/testops-ci [PR#]` closes the loop on that CI run — reads per-test
retry outcomes from the `pwreport-*` artifacts (flaky vs failed), discusses each issue
one at a time, applies agreed test-side fixes verified locally, and pushes until green
(max 3 fix iterations). `/status` derives progress from which deliverables exist.
`/bootstrap` regenerates `.claude/project/`, including distilling `overridden:` review
decisions into `review-calibration.md`. Scaffold a new target with `/new-ui-app` /
`/new-api-app`, then run the workflow.

## Conventions

The code-generation conventions — dual-style POM/SOM, the three-section POM layout, BDD
file naming, feature-file rules, locators, and tags — are the single-source contract in
Project Memory: [`.claude/project/conventions.md`](.claude/project/conventions.md)
(reference POM: `apps/saucedemo/pom/login.page.ts`). Stack + full run matrix:
[`.claude/project/stack.md`](.claude/project/stack.md).

### Pre-merge checklist

```bash
npx tsc --noEmit                       # type-check
npm test                               # spec smoke (all apps)
npm run test:bdd                       # BDD smoke (all apps)
npm run test:bdd:regression            # full BDD regression
```

All must be green. External targets (petstore) can be slow/flaky — prefer
`expect.poll` and generous timeouts; assert shape over exact counts; re-run before
declaring a flake a failure.
